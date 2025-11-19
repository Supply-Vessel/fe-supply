"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import { type CreateParameterData } from "./types"
import { Input } from "@/src/components/ui/input"
import type { BaseSyntheticEvent } from "react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import type React from "react"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/src/components/ui/dialog'

const formSchema = z.object({
    parameterName: z.string().min(1, "Parameter name is required").max(50, "Parameter name must be less than 50 characters"),
    parameterValue: z.number().min(1, "Parameter value is required").max(50, "Parameter value must be less than 50 characters"),
    parameterUnit: z.string().min(1, "Parameter unit is required").max(50, "Parameter unit must be less than 50 characters"),
})

interface ParameterDialogProps {
    onSubmit: (data: CreateParameterData, event?: BaseSyntheticEvent) => Promise<void>
    setOpen: (open: boolean) => void
    loadingButtonText: string
    trigger?: React.ReactNode
    submitButtonText: string
    open: boolean
}

export function ParameterDialog({ 
    loadingButtonText,
    submitButtonText,
    onSubmit, 
    setOpen,
    open,
}: ParameterDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        parameterName: "",
        parameterValue: 0,
        parameterUnit: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>, event?: BaseSyntheticEvent) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...values,
      }, event)
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error adding animal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto" 
        id="add-animal-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onInteractOutside={(e) => {
          // Предотвращаем закрытие диалога при клике на Select dropdown
          const target = e.target as Element
          if (target && target.closest('[data-radix-select-content]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
          <DialogDescription>
            Enter the details for the new parameter. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parameterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Blood Glucose" {...field} />
                    </FormControl>
                    <FormDescription>Unique name for this parameter</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parameterValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter Value</FormLabel>
                    <FormControl>
                      <Input
                       placeholder="Optional parameter value"
                       {...field}
                       type="number"
                       value={field.value || ""}
                       onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Optional value for the parameter</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parameterUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="mg/dL/ml/g/etc." {...field} />
                    </FormControl>
                    <FormDescription>Optional parameter unit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#2563EB" }}>
                {isSubmitting ? `${loadingButtonText}...` : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
