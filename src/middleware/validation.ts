import { NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
) {
  try {
    return {
      data: schema.parse(data),
      error: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors
      };
    }
    return {
      data: null,
      error: [{ message: 'Erreur de validation' }]
    };
  }
}

export async function withValidation<T extends z.ZodType>(
  request: Request,
  schema: T,
  handler: (validData: z.infer<T>) => Promise<Response>
) {
  try {
    const body = await request.json();
    const { data, error } = validateRequest(schema, body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return handler(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de traitement de la requête' },
      { status: 500 }
    );
  }
} 