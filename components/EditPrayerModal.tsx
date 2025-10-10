import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { updatePrayer } from "@/lib/actions/prayerly.actions";

interface EditPrayerModalProps {
  prayer: {
    id: string;
    title: string;
    content: string;
    privacy: string;
  };
  onClose: () => void;
  onSave: () => void;
}

const EditPrayerModal = ({ prayer, onClose, onSave }: EditPrayerModalProps) => {
  const [title, setTitle] = useState(prayer.title);
  const [content, setContent] = useState(prayer.content);
  const [privacy, setPrivacy] = useState(prayer.privacy);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (title.trim() && content.trim()) {
      setLoading(true);
      try {
        await updatePrayer(prayer.id, { title, content, privacy });
        onSave();
        onClose();
      } catch (error) {
        console.error("Failed to update prayer", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">✏️ Edit Prayer</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="cursor-pointer"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="Enter prayer title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prayer">Prayer</Label>
            <Textarea
              id="edit-prayer"
              placeholder="Write your prayer here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={privacy} onValueChange={setPrivacy}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="edit-private" />
                  <Label htmlFor="edit-private">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loved-ones" id="edit-loved-ones" />
                  <Label htmlFor="edit-loved-ones">Loved Ones</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="edit-public" />
                  <Label htmlFor="edit-public">Public</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 border-t flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 cursor-pointer"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 cursor-pointer"
            disabled={!title.trim() || !content.trim() || loading}
          >
            {loading ? "Saving..." : "💾 Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPrayerModal;
