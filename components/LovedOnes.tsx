import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const LovedOnes = () => {
  const [LovedOnes, setLovedOnes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRelationship, setNewRelationship] = useState("");
  const [addingLovedOne, setAddingLovedOne] = useState(false);

  useEffect(() => {
    loadLovedOnes();
  }, []);

  const loadLovedOnes = async () => {
    try {
    } catch (error) {}
  };

  const handleAddLovedOne = async () => {};

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return "Just now";
  };

  const getAvatar = (name: string) => {
    const avatars = ["👨‍💻", "👩‍💼", "👨‍🎓", "👩‍⚕️", "👨‍🍳", "👩‍🎨", "👨‍💼", "👩‍🔬"];
    return avatars[name.length % avatars.length];
  };

  return (
    <div className="pb-20 px-4 max-w-md mx-auto">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">👥</span>
          <h2>Loved Ones&apos; Prayers</h2>
        </div>

        <Card className="mb-6">
          <CardContent className="">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>Family Circle</h3>
                <p className="text-sm text-muted-foreground">
                  {LovedOnes.length} members
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading loved ones...
                </div>
              ) : LovedOnes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No loved ones added yet.</p>
                  <p className="text-sm mt-1">
                    Add some loved ones to share prayers!
                  </p>
                </div>
              ) : (
                LovedOnes.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 p-2 rounded-lg border"
                  >
                    <div className="text-2xl">{person.name}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary">{person.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({person.relationship})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        &quot;{person.recentPrayer}&quot;
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span>{formatTimeAgo(person.lastActive)}</span>
                        <Button size="sm" variant="ghost">
                          <MessageCircle size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer" variant="outline">
              <Plus size={16} className="mr-2" />
              Add Loved One
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Loved One</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter their email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select
                  value={newRelationship}
                  onValueChange={setNewRelationship}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent className="w-full block">
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddLovedOne}
                className="w-full"
                disabled={
                  !newEmail.trim() || !newRelationship.trim() || addingLovedOne
                }
              >
                {addingLovedOne ? "Adding..." : "Add Loved One"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-6 space-y-4">
          <h3>Recent Prayer Requests</h3>
          <Card>
            <CardContent className="">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🙏</span>
                <span className="text-primary">Sarah</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                &quot;Please pray for my upcoming job interview tomorrow. I
                really need this oppurtunity.&quot;
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">30m ago</span>
                <Button size="sm">I&apos;ll Pray</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LovedOnes;
