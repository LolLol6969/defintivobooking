"use client"

import React, { useEffect, useRef, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/src/lib/supabase/client" // Percorso corretto

const bookingSchema = z.object({
  suite_name: z.string().min(1, "Seleziona una suite."),
  full_name: z.string().min(1, "Il nome completo è richiesto."),
  email: z.string().email("Inserisci un'email valida."),
  phone: z.string().optional(),
  check_in_date: z.date({
    required_error: "La data di check-in è richiesta.",
  }),
  check_out_date: z.date({
    required_error: "La data di check-out è richiesta.",
  }),
  num_guests: z.coerce.number().min(1, "Il numero di ospiti deve essere almeno 1."),
  message: z.string().optional(),
}).refine((data) => data.check_out_date > data.check_in_date, {
  message: "La data di check-out deve essere successiva alla data di check-in.",
  path: ["check_out_date"],
});

const suites = [
  { name: "Ocean Dream", value: "Ocean Dream" },
  { name: "Sky Loft", value: "Sky Loft" },
  { name: "Garden Haven", value: "Garden Haven" },
  { name: "Elysian Presidential", value: "Elysian Presidential" },
];

export default function PrenotaPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      suite_name: "",
      full_name: "",
      email: "",
      phone: "",
      num_guests: 1,
      message: "",
    },
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    if (formSectionRef.current) observer.observe(formSectionRef.current);

    return () => observer.disconnect();
  }, []);

  async function onSubmit(values: z.infer<typeof bookingSchema>) {
    try {
      // Insert booking into Supabase
      const { data, error } = await supabase.from("bookings").insert([
        {
          suite_name: values.suite_name,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
          check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
          num_guests: values.num_guests,
          message: values.message,
        },
      ]).select();

      if (error) {
        throw new Error(error.message);
      }

      console.log("Prenotazione effettuata con successo:", data);
      alert("Prenotazione effettuata con successo!"); // Using alert as toast is removed
      form.reset();
    } catch (error: any) {
      console.error("Booking error:", error);
      alert(`Errore durante la prenotazione: ${error.message}`); // Using alert as toast is removed
    }
  }

  return (
    <div className="min-h-screen beach-background">
      <Header />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-center elysian-secondary mb-16 text-balance"
          >
            Prenota la Tua Suite
          </h1>

          <div ref={formSectionRef} className="glass-panel p-8 md:p-12">
            <h2 className="text-2xl font-bold elysian-primary mb-6">Dettagli Prenotazione</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="suite_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Suite</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300">
                            <SelectValue placeholder="Seleziona una suite" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suites.map((suite) => (
                            <SelectItem key={suite.value} value={suite.value}>
                              {suite.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Il tuo nome e cognome"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="la.tua@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Telefono (Opzionale)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+39 123 4567890"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="check_in_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Check-in</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Seleziona data</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="check_out_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Check-out</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Seleziona data</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < (form.watch("check_in_date") || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="num_guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Numero Ospiti</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          min="1"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Messaggio (Opzionale)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hai richieste speciali?"
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent transition-all duration-300 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-elysian-primary text-elysian-secondary py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Conferma Prenotazione
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}