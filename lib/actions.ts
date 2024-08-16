'use server';

import { z } from 'zod';
import prisma from './prisma';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client/extension';
import * as argon2 from 'argon2';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { generateEncryptionKey } from '@/app/utils/utilityFuncs';

const CreateUser = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const UpdateUser = z
  .object({
    name: z.string().min(1, 'Name cannot be empty'),
    password: z.string().optional(),
    retypedPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.retypedPassword, {
    message: "Passwords don't match",
    path: ['retypedPassword'],
  });

const CreateDream = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  analysis: z.string().min(1, 'Analysis cannot be empty'),
  content: z.string().min(1, 'Content cannot be empty'),
  keyElements: z.array(z.string().min(1, 'Key element cannot be empty')),
  dreamerId: z.string().min(1, 'Dreamer ID cannot be empty'),
});

const UpdateLifeContext = z.object({
  lifeContext: z.string().min(1, 'Life context cannot be empty'),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    lifeContext?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Failed to create user.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const encryptedPassword = await argon2.hash(password);
  const encryptionKey = generateEncryptionKey();

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        password: encryptedPassword,
        lifeContext: '',
        encryptionKey: encryptionKey,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return { message: 'Database error. Failed to create user.' };
  }
  return redirect('/login');
}

export async function updateUser(
  email: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    password: formData.get('password'),
    retypedPassword: formData.get('password-retype'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Failed to update user.',
    };
  }

  const { name, password } = validatedFields.data;
  const updateData: any = { name };

  if (password) {
    updateData.password = await argon2.hash(password);
  }

  try {
    await prisma.user.update({
      where: { email },
      data: updateData,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return { message: 'Database error. Failed to update user.' };
  }
  redirect('/');
}

export async function updateLifeContext(
  email: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = UpdateLifeContext.safeParse({
    lifeContext: formData.get('context'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Failed to update life context.',
    };
  }

  const { lifeContext } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        lifeContext,
      },
    });
  } catch (e) {
    return { message: 'Database Error: Failed to update life context.' };
  }
  return { message: 'Successfully updated life context' };
}

export async function createDream(
  dreamDetails: {
    content: string;
    analysis: string;
    elements: string[];
    title: string;
    dreamerId: string;
  },
  prismaClient: PrismaClient = prisma
) {
  const validatedFields = CreateDream.safeParse({
    title: dreamDetails.title,
    analysis: dreamDetails.analysis,
    content: dreamDetails.content,
    keyElements: dreamDetails.elements,
    dreamerId: dreamDetails.dreamerId,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Failed to create dream.',
    };
  }

  const { title, content, keyElements, dreamerId, analysis } =
    validatedFields.data;

  try {
    await prismaClient.dream.create({
      data: {
        title,
        analysis,
        content,
        keyElements,
        dreamerId,
      },
    });
  } catch (error) {
    console.error('Error creating dream:', error);
    return { message: 'Database error. Failed to create dream.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
