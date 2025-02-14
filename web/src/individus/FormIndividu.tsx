"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router";

const formSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  date_naissance: z.date({
    required_error: "La date de naissance est requise",
  }),
});

export default function FormPage() {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/individu`,
        {
          ...values,
          date_naissance: format(values.date_naissance, "dd/MM/yyyy"),
        }
      );

      if (response.status === 201) {
        setSubmissionStatus("Individu ajouté avec succès!");
      } else {
        setSubmissionStatus("Erreur lors de l'ajout de l'individu.");
      }
      form.reset();
    } catch (error) {
      console.log(error);
      setSubmissionStatus("Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  return (
    <>
      <div onClick={() => navigate("/")} className="absolute top-4 left-4">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la page d'accueil
        </Button>
      </div>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className=" p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Enregistrer un individu
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_naissance"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: fr })
                            ) : (
                              <span>Choisissez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Soumettre
              </Button>
            </form>
          </Form>
          {submissionStatus && (
            <p
              className={`mt-4 text-center ${
                submissionStatus.includes("succès")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submissionStatus}
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
