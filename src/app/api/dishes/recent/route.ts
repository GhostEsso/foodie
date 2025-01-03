import { NextResponse } from "next/server";
import { DishService } from "../../../../services/dish.service";

const dishService = new DishService();

export async function GET() {
  try {
    const dishes = await dishService.getRecentDishes();
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("[RECENT_DISHES_GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des plats récents" },
      { status: 500 }
    );
  }
} 