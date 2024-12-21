import { NextResponse } from 'next/server';
import { DishService } from '@/services/dish.service';
import { withValidation } from '@/middleware/validation';
import { DishSchema } from '@/models';
import { getSession } from '@/lib/auth';
import { useStore } from '@/lib/store';

const dishService = new DishService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      available: searchParams.get('available') === 'true',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      search: searchParams.get('search') || undefined
    };

    const dishes = await dishService.findAll(filters);
    useStore.getState().setDishes(dishes);
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Erreur lors de la récupération des plats:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des plats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return withValidation(request, DishSchema, async (validData) => {
      const dish = await dishService.create(validData, session.id);
      useStore.getState().addDish(dish);
      return NextResponse.json(dish);
    });
  } catch (error) {
    console.error('Erreur lors de la création du plat:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création du plat" },
      { status: 500 }
    );
  }
} 