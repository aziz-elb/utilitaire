import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Edit,
  Archive,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "date-fns";

//adsfasdfasdfasdf nouveu

import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const ProjectView = () => {
  const { id } = useParams();
  const [myproject, setMyproject] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    code: "",
    date_debut: "",
    date_fin: "",
    date_cible: "",
    fk_type_projet_id: "",
    fk_statut_projet_id: "",
  });

  // Charger les données du projet
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/projet/${id}`);
        setMyproject(res.data);
        setFormData({
          titre: res.data.titre,
          description: res.data.description,
          code: res.data.code,
          date_debut: res.data.date_debut,
          date_fin: res.data.date_fin,
          date_cible: res.data.date_cible,
          fk_type_projet_id: res.data.fk_type_projet_id,
          fk_statut_projet_id: res.data.fk_statut_projet_id,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Fonction pour mettre à jour le projet
  const handleUpdateProject = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/projet/${id}`, {
        ...formData,
        progression_pct: formData.progression_pct || 0,
        actif_yn: formData.actif_yn !== false,
      });
      setMyproject(res.data);
      setOpenEditDialog(false);
      toast.success("Projet mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du projet");
      console.error(error);
    }
  };

  // Mock data - would come from API
  const project = {
    id: 1,
    name: "E-commerce Platform",
    description:
      "Modern online store with payment integration and inventory management system. This project includes user authentication, product catalog, shopping cart functionality, and admin dashboard.",
    status: "In Progress",
    progress: 75,
    priority: "High",
    startDate: "2024-03-15",
    endDate: "2024-07-15",
    members: [
      {
        id: 1,
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg",
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Senior Developer",
        avatar: "/placeholder.svg",
      },
      {
        id: 3,
        name: "Mike Johnson",
        role: "UI/UX Designer",
        avatar: "/placeholder.svg",
      },
    ],
    tasks: [
      {
        id: 1,
        title: "Database Schema Design",
        status: "Completed",
        assignee: "Jane Smith",
      },
      {
        id: 2,
        title: "User Authentication",
        status: "In Progress",
        assignee: "Jane Smith",
      },
      {
        id: 3,
        title: "Product Catalog UI",
        status: "In Progress",
        assignee: "Mike Johnson",
      },
      {
        id: 4,
        title: "Payment Integration",
        status: "Todo",
        assignee: "John Doe",
      },
      {
        id: 5,
        title: "Admin Dashboard",
        status: "Todo",
        assignee: "Jane Smith",
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-inwi-secondary" />;
      case "Todo":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {myproject.titre}
            </h1>
            <Badge className="bg-inwi-purple hover:bg-inwi-dark-purple text-white">
              {project.status}
            </Badge>
            <Badge variant="destructive">{project.priority}</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {project.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress
              value={project.progress}
              className="mt-2 [&>div]:bg-inwi-purple"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.members.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Debut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{project.startDate}</div>
            <p className="text-xs text-muted-foreground">Project started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Fin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{project.endDate}</div>
            <p className="text-xs text-muted-foreground">
              Deadline approaching
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>
                Track the progress of individual tasks in this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Assigned to {task.assignee}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn({
                        "bg-green-500 text-white border-transparent":
                          task.status === "Completed",
                        "bg-inwi-secondary text-white border-transparent":
                          task.status === "In Progress",
                      })}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Key milestones and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Timeline feature coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                File management feature coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier le Projet</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de début</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) =>
                    setFormData({ ...formData, date_debut: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_fin">Date de fin</Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, date_fin: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_cible">Date cible</Label>
                <Input
                  id="date_cible"
                  type="date"
                  value={formData.date_cible}
                  onChange={(e) =>
                    setFormData({ ...formData, date_cible: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de projet</Label>
                <Select
                  value={formData.fk_type_projet_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_type_projet_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Interne</SelectItem>
                    <SelectItem value="2">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.fk_statut_projet_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_statut_projet_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">En attente</SelectItem>
                    <SelectItem value="2">En cours</SelectItem>
                    <SelectItem value="3">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Barre de progression */}
            <div className="flex justify-between grid-cols-2 items-center">
              <div className="space-y-2">
                <Label htmlFor="progression">Progression</Label>
                <div className="flex items-center gap-4"></div>
                <Input
                  type="range"
                  id="progression"
                  min="0"
                  max="100"
                  value={formData.progression_pct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progression_pct: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-inwi-purple"
                />
              </div>

              {/* Switch pour actif/inactif */}
              <div className="flex items-center space-x-2 pt-2 mr-10">
                <Switch
                  id="actif"
                  checked={formData.actif_yn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, actif_yn: checked })
                  }
                />
                <Label htmlFor="actif">
                  {formData.actif_yn ? (
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Inactif</Badge>
                  )}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdateProject}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectView;
