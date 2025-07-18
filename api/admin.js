import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db('investpro');
  
  try {
    // Verify admin token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    // Get data based on request
    if (req.method === 'GET') {
      const { type } = req.query;
      
      if (type === 'users') {
        const users = await db.collection('users').find({}).toArray();
        return res.json(users);
      }
      
      if (type === 'deposits') {
        const deposits = await db.collection('deposits').find({}).toArray();
        return res.json(deposits);
      }
      
      if (type === 'withdrawals') {
        const withdrawals = await db.collection('withdrawals').find({}).toArray();
        return res.json(withdrawals);
      }
    }
    
    // Handle approval of withdrawals/deposits
    if (req.method === 'POST') {
      const { action, id } = req.body;
      
      if (action === 'approve-withdrawal') {
        await db.collection('withdrawals').updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'approved' } }
        );
        return res.json({ success: true });
      }
      
      // Add other actions as needed
    }
    
  } finally {
    await client.close();
  }
  }
