"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { RequestStatus, RequestType, PaymentStatus, TSIConfirm, PoStatus, type RequestEnums, type Request } from "./types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
    id: z.string().min(1, "Id is required"),
    identifier: z.string().min(1, "Identifier is required").max(50, "Identifier must be less than 5 characters"),
    description: z.string().optional(),
    requestType: z.nativeEnum(RequestType),
    poStatus: z.nativeEnum(PoStatus).optional(),
    tsiConfirm: z.nativeEnum(TSIConfirm).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    status: z.nativeEnum(RequestStatus),
    poNumber: z.string().optional(),
    companyOfOrder: z.string().optional(),
    countryOfOrder: z.string().optional(),
    vesselId: z.string().min(1, "Vessel id is required"),
})

  interface EditAnimalDialogProps {
    onSubmit: (request: Partial<Request>) => Promise<void>
    setOpen: (open: boolean) => void
    selectedRequest: Request | null
    requestEnums: RequestEnums
    loadingButtonText: string
    submitButtonText: string
    userId: string
    labId: string
    open: boolean
}

export function EditAnimalDialog({ 
    loadingButtonText,
    submitButtonText,
    selectedRequest,
    requestEnums,
    onSubmit,
    setOpen,
    labId,
    open,
}: EditAnimalDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    console.log(selectedRequest);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        vesselId: labId,
        status: RequestStatus.WAITING,
        identifier: "",
        description: "",
        requestType: undefined,
        poStatus: undefined,
        tsiConfirm: undefined,
        paymentStatus: undefined,
        poNumber: "",
        companyOfOrder: "",
        countryOfOrder: "",
    },
  })

  useEffect(() => {
    if (selectedRequest) {
      form.reset({
        id: selectedRequest?.id,
        vesselId: labId,
        identifier: selectedRequest?.identifier,
        description: selectedRequest?.description,
        requestType: selectedRequest?.requestType,
        poStatus: selectedRequest?.poStatus,
        tsiConfirm: selectedRequest?.tsiConfirm,
        paymentStatus: selectedRequest?.paymentStatus,
        status: selectedRequest?.status,
        poNumber: selectedRequest?.poNumber,
        companyOfOrder: selectedRequest?.companyOfOrder,
        countryOfOrder: selectedRequest?.countryOfOrder,
      })
    } else {
      form.reset({
        vesselId: labId,
        status: RequestStatus.WAITING,
        identifier: "",
        description: "",
        requestType: undefined,
        poStatus: undefined,
        tsiConfirm: undefined,
        paymentStatus: undefined,
        poNumber: "",
        companyOfOrder: "",
        countryOfOrder: "",
      })
    }
  }, [selectedRequest]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
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
        id="edit-request-dialog"
        onInteractOutside={(e) => {
          // Предотвращаем закрытие диалога при клике на Select dropdown
          const target = e.target as Element
          if (target && target.closest('[data-radix-select-content]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Request ({selectedRequest?.identifier})</DialogTitle>
          <DialogDescription>
            Edit the details for the request. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identifier */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier *</FormLabel>
                    <FormControl>
                      <Input placeholder="E001, EL002 D003, etc." {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier for this request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional request description" {...field} />
                    </FormControl>
                    <FormDescription>Optional request description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Request Type */}
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.requestType.length === 0 ? (
                          <div className="p-2 text-center text-sm text-gray-500">
                            No request types found
                          </div>
                        ) : (
                          requestEnums.requestType.map((type: RequestType) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Type of the request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Po Status */}
              <FormField
                control={form.control}
                name="poStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Po Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select po status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.poStatus.map((poStatus: PoStatus) => (
                          <SelectItem key={poStatus} value={poStatus}>
                            {poStatus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Status of the purchase order</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TSI Confirm */}
              <FormField
                control={form.control}
                name="tsiConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TSI Confirm</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tsi confirm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.tsiConfirm.map((tsiConfirm: TSIConfirm) => (
                          <SelectItem key={tsiConfirm} value={tsiConfirm}>
                            {tsiConfirm}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Status of the tsi confirm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status */}
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.paymentStatus.map((paymentStatus: PaymentStatus) => (
                          <SelectItem key={paymentStatus} value={paymentStatus}>
                            {paymentStatus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Status of the payment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.requestStatus.map((requestStatus: RequestStatus) => (
                          <SelectItem key={requestStatus} value={requestStatus}>
                            {requestStatus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Status of the request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Po Number */}
              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Po Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter po number" {...field} />
                    </FormControl>
                    <FormDescription>Number of the purchase order</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Of Order */}
              <FormField
                control={form.control}
                name="companyOfOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Of Order</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company of order" {...field} />
                    </FormControl>
                    <FormDescription>Company of the order</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Of Order */}
              <FormField
                control={form.control}
                name="countryOfOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Of Order</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country of order" {...field} />
                    </FormControl>
                    <FormDescription>Country of the order</FormDescription>
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
