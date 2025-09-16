import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface PrayerCreationProps {
  onClose: () => void;
  onSave: (prayer: { title: string; content: string; privacy: string }) => void;
}

const PrayerCreation = ({ onClose, onSave }: PrayerCreationProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (title.trim() && content.trim()) {
      setLoading(true);
      try {
        onSave({ title, content, privacy });
        onClose();
      } catch (error) {
        console.error("Failed to save prayer", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg">✍️ Write Your Prayer</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter prayer title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayer">Prayer</Label>
          <Textarea
            id="prayer"
            placeholder="Write your prayer here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Share Options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={privacy} onValueChange={setPrivacy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loved-Ones" id="loved-ones" />
                <Label htmlFor="loved-ones">Loved Ones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border-t">
        <Button
          onClick={handleSave}
          className="w-full"
          disabled={!title.trim() || !content.trim() || loading}
        >
          {loading ? "Saving..." : "🙏 Save & Share"}
        </Button>
      </div>
    </div>
  );
};

export default PrayerCreation;
