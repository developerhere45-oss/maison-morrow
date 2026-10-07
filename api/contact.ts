import { validateContact } from '../backend/api/contact';

type Request = { method?: string; body?: unknown };
type Response = { status: (code: number) => Response; json: (body: object) => Response };

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  const error = validateContact(req.body ?? {});
  if (error) return res.status(400).json({ message: error });
  // Connect an email provider here using CONTACT_RECIPIENT; no visitor data is stored by default.
  return res.status(200).json({ message: 'Thanks — your note has been received.' });
}
