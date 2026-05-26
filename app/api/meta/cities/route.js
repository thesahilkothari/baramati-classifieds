import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        state: true,
        latitude: true,
        longitude: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return new Response(
      JSON.stringify({ data: cities }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching cities:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch cities' }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // TODO: Add admin verification
    const body = await request.json();
    const { name, state = 'Maharashtra', latitude, longitude } = body;

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { status: 400 }
      );
    }

    // Create slug
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const city = await prisma.city.create({
      data: {
        name,
        slug,
        state,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'City created successfully',
        city,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating city:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create city' }),
      { status: 500 }
    );
  }
}
