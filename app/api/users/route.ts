import { NextApiRequest, NextApiResponse } from "next";
import { authAdmin } from "@/lib/firebaseAdmin";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData[] | { error: string }>
) {
  // Verify authentication (server-side)
  try {
    // Add your authentication logic here
    // Example: await verifyToken(req)

    const users: UserData[] = [];
    let nextPageToken: string | undefined;

    do {
      const result = await authAdmin.listUsers(1000, nextPageToken);
      users.push(...result.users.map(user => ({
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
      })));
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    res.status(200).json(users);
  } catch (error) {
    console.error("Detailed users fetch error:", error);
    res.status(500).json({ 
      error: "Error fetching users", 
     
    });
  }
}