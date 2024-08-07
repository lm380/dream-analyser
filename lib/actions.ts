'use server';

import { z } from 'zod';
import prisma from './prisma';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client/extension';
import * as argon2 from 'argon2';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const DreamSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  analysis: z.string(),
  keyElements: z.string().array(),
  dreamer: z.any(),
  dreamerId: z.string(),
});

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    message: 'Please enter a valid name',
  }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string({}),
  createdAt: z.string(),
  updatedAt: z.string(),
  dreams: z.array(DreamSchema),
});

const CreateUser = FormSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  dreams: true,
});
const UpdateUser = CreateUser.extend({
  retypedPassword: z.string({}),
}).omit({
  email: true,
});
const CreateDream = DreamSchema.omit({
  id: true,
  dreamer: true,
});
const UpdateLifeContext = UpdateUser.extend({
  lifeContext: z.string(),
}).omit({
  retypedPassword: true,
  password: true,
  name: true,
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
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
      message: 'Missing Fields. Failed to Create User',
    };
  }

  const { name, email, password } = validatedFields.data;
  const encryptedPassword = await argon2.hash(password);
  try {
    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: encryptedPassword,
        lifeContext: '',
      },
    });
  } catch (e) {
    return { message: 'Database Error: Failed to Create User.' };
  }
  redirect('/');
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
      message: 'Missing Fields. Failed to Create User',
    };
  }

  const { name, password, retypedPassword } = validatedFields.data;
  if (retypedPassword !== password) {
    return {
      errors: { password: ["Passwords don't match"] },
      message: "Passwords don't match",
    };
  }

  if (password) {
    const encryptedPassword = await argon2.hash(password);
    try {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name: name,
          password: encryptedPassword,
        },
      });
    } catch (e) {
      return { message: 'Database Error: Failed to Update User.' };
    }
  } else {
    try {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name: name,
        },
      });
    } catch (e) {
      return { message: 'Database Error: Failed to Update User.' };
    }
  }
  redirect('/');
}

export async function updateLifeContext(
  email: string,
  prevState: State | undefined,
  formData: FormData
) {
  const validatedCircumstances = UpdateLifeContext.safeParse({
    lifeContext: formData.get('context'),
  });

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        lifeContext: validatedCircumstances.data?.lifeContext,
      },
    });
  } catch (e) {
    return { message: 'Database Error: Failed to Create User.' };
  }
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

  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Dream',
    };
  }

  const { title, content, keyElements, dreamerId, analysis } =
    validatedFields.data;
  // const encryptedContent = await bcrypt.hash(content, 10);
  // need to find some way to encrypt the content and decrypt hashing won't work
  try {
    await prismaClient.dream.create({
      data: {
        title: title,
        analysis: analysis,
        content: content,
        keyElements: keyElements,
        dreamerId: dreamerId,
      },
    });
  } catch (e) {
    return { message: 'Database Error: Failed to Create Dream.' };
  }
  //   revalidatePath('/analyser');
  redirect('/');
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
