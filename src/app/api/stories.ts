/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/mongodb';
import Story from '@/app/models/Story';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { theme } = req.query;
    try {
      const filter = theme ? { theme: theme.toString() } : {};
      const stories = await Story.find(filter);
      res.status(200).json({ stories });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stories' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
