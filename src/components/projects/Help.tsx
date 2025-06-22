
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, LifeBuoy } from "lucide-react";

const faqs = [
  {
    question: "Comment puis-je créer un nouveau projet ?",
    answer: "Pour créer un nouveau projet, allez dans la section 'Projets' depuis le menu de navigation et cliquez sur le bouton 'Nouveau Projet'. Remplissez ensuite le formulaire avec les informations requises et sauvegardez.",
  },
  {
    question: "Où puis-je voir la liste des membres de l'équipe ?",
    answer: "La liste complète des membres de l'équipe est disponible dans la section 'Membres'. Vous pouvez y rechercher, filtrer et voir les détails de chaque membre.",
  },
  {
    question: "Est-il possible d'exporter les données d'un projet ?",
    answer: "Oui, sur la page de la liste des projets en vue tableau, vous trouverez une option pour exporter les données au format CSV. Cette fonctionnalité se trouve généralement au-dessus du tableau.",
  },
  {
    question: "Comment réinitialiser mon mot de passe ?",
    answer: "Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser depuis la page de connexion en cliquant sur le lien 'Mot de passe oublié ?'. Suivez ensuite les instructions envoyées à votre adresse e-mail.",
  },
];

const HelpPage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 animate-fade-in">
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
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

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
