import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { CreateSessionRequest } from '@/types/session';

interface CreateSessionDialogProps {
  onSubmit: (data: CreateSessionRequest) => Promise<unknown>;
  isLoading?: boolean;
}

export function CreateSessionDialog({ onSubmit, isLoading }: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    pages: 0,
    inkUse: 0,
    optimizingScore: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ userId: '', pages: 0, inkUse: 0, optimizingScore: 0 });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Create a new print session. This will POST to /sessions endpoint.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID (ObjectId)</Label>
              <Input
                id="userId"
                placeholder="65f1a2b3c4d5e6f7a8b9c0d1"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                required
                className="font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  min="0"
                  placeholder="42"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pages: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inkUse">Ink (ml)</Label>
                <Input
                  id="inkUse"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.18"
                  value={formData.inkUse || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, inkUse: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="optimizingScore">Score</Label>
                <Input
                  id="optimizingScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="82"
                  value={formData.optimizingScore || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, optimizingScore: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
