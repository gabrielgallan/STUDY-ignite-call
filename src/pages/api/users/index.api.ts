import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/database/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, username } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await prisma.user.create({
        data: {
            name,
            username,
        },
    });

    setCookie('@ignitecall.user_id', user.id, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return res.status(201).json(user);
}
