import { useState } from "react";
import { Search, Plus, LifeBuoy, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [faqs, setFaqs] = useState([
    {
      question: "Comment puis-je créer un nouveau projet ?",
      answer: "Pour créer un nouveau projet, allez dans la section 'Projets' depuis le menu de navigation et cliquez sur le bouton 'Nouveau Projet'. Remplissez ensuite le formulaire avec les informations requises et sauvegardez.",
    },
    {
      question: "Où puis-je voir la liste des membres de l'équipe ?",
      answer: "La liste complète des membres de l'équipe est disponible dans la section 'Membres'. Vous pouvez y rechercher, filtrer et voir les détails de chaque membre.",
    },
    // ... autres questions initiales
  ]);

  const handleAddFaq = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setFaqs([{ question: newQuestion, answer: newAnswer }, ...faqs]);
      setNewQuestion("");
      setNewAnswer("");
      setOpenAddDialog(false);
    }
  };

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    // Filtrer les FAQs en fonction de la recherche
    // Implémentez cette logique si nécessaire
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 animate-fade-in">
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8">
        <div className="relative flex-1 max-w-lg w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans l'aide..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une question
        </Button>
      </div>

      {/* Dialogue d'ajout simplifié */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle question</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle question et sa réponse à la FAQ
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Entrez la question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Réponse</Label>
              <Textarea
                id="answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Entrez la réponse"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddFaq}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contenu de la page d'aide */}
      <div className="mb-12 text-center">
        <LifeBuoy className="mx-auto h-16 w-16 text-inwi-purple mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Centre d'aide</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Trouvez des réponses à vos questions et contactez-nous si vous avez besoin d'aide.
        </p>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Section contact */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Besoin de plus d'aide ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <Card>
            <CardHeader>
              <Mail className="mx-auto h-10 w-10 text-inwi-purple mb-2" />
              <CardTitle className="text-xl">Par Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Envoyez-nous un email et nous vous répondrons dès que possible.</p>
              <a href="mailto:support@inwi.ma" className="font-medium text-inwi-purple hover:underline">
                support@inwi.ma
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Phone className="mx-auto h-10 w-10 text-inwi-purple mb-2" />
              <CardTitle className="text-xl">Par Téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Notre équipe est disponible du Lundi au Vendredi de 9h à 18h.</p>
              <a href="tel:+2125XXXXXXXX" className="font-medium text-inwi-purple hover:underline">
                +212 5XX XX XX XX
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;