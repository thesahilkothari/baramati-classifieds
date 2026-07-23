function parseInlineMarkdown(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldStart = remaining.indexOf("**");

    if (boldStart === -1) {
      parts.push(remaining);
      break;
    }

    if (boldStart > 0) {
      parts.push(remaining.slice(0, boldStart));
    }

    const afterStart = remaining.slice(boldStart + 2);
    const boldEnd = afterStart.indexOf("**");

    if (boldEnd === -1) {
      parts.push(remaining);
      break;
    }

    const boldText = afterStart.slice(0, boldEnd);
    parts.push(
      <strong key={`bold-${key}`} className="font-black text-slate-950">
        {boldText}
      </strong>
    );
    key += 1;
    remaining = afterStart.slice(boldEnd + 2);
  }

  return parts;
}

export default function MarkdownContent({ content }) {
  const lines = String(content || "").split(/\r?\n/);

  return (
    <div className="space-y-4 text-sm leading-7 text-slate-700 md:text-base">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-1" />;
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-black text-slate-950">
              {trimmed.replace(/^#\s+/, "")}
            </h1>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-4 text-2xl font-black text-slate-950">
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-3 text-xl font-black text-slate-950">
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <p key={index} className="pl-4">
              <span className="font-black text-blue-700">• </span>
              {parseInlineMarkdown(trimmed.replace(/^-\s+/, ""))}
            </p>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <p key={index} className="pl-4 font-semibold text-slate-800">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="rounded-2xl border-l-4 border-blue-700 bg-blue-50 p-4 font-semibold text-blue-950"
            >
              {parseInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        return <p key={index}>{parseInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}
