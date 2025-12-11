"use client"

import { RequestStatus, PaymentStatus, TSIConfirm, PoStatus, type RequestEnums, type Request, WayBillType, type RequestTypeModel } from "./types"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
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

function getWayBillNumberPlaceholder(wayBillType?: WayBillType) {
  switch (wayBillType) {
    case WayBillType.AIR_WAYBILL:
      return "020-17363006"
    case WayBillType.PARCEL_WAYBILL:
      return "AENM0021834400"
    default:
      return "waybill number..."
  }
}

const formSchema = z.object({
    identifier: z.string().min(1, "Identifier is required").max(50, "Identifier must be less than 50 characters"),
    description: z.string().optional(),
    wayBillNumber: z.string().optional(),
    storeLocation: z.string().optional(),
    wayBillType: z.nativeEnum(WayBillType).default(WayBillType.NO_WAYBILL),
    requestTypeId: z.string().min(1, "Request type is required"),
    poStatus: z.nativeEnum(PoStatus).optional(),
    tsiConfirm: z.nativeEnum(TSIConfirm).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    status: z.nativeEnum(RequestStatus),
    poNumber: z.string().optional(),
    companyOfOrder: z.string().optional(),
    countryOfOrder: z.string().optional(),
})

interface AddAnimalDialogProps {
    onSubmit: (request: Partial<Request>) => Promise<void>
    setOpen: (open: boolean) => void
    requestEnums: RequestEnums
    requestTypes?: RequestTypeModel[]
    loadingButtonText: string
    trigger?: React.ReactNode
    submitButtonText: string
    userId: string
    open: boolean
}

export function AddAnimalDialog({ 
    loadingButtonText,
    submitButtonText,
    requestEnums,
    requestTypes = [],
    onSubmit, 
    setOpen,
    open,
}: AddAnimalDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        identifier: "",
        description: "",
        wayBillType: WayBillType.NO_WAYBILL,
        wayBillNumber: "",
        storeLocation: "",
        requestTypeId: "",
        poStatus: undefined,
        tsiConfirm: undefined,
        paymentStatus: undefined,
        status: RequestStatus.WAITING,
        poNumber: undefined,
        companyOfOrder: undefined,
        countryOfOrder: undefined,
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...values
      })
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error adding request:", error)
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
        id="add-request-dialog"
        onInteractOutside={(e) => {
          const target = e.target as Element
          if (target && target.closest('[data-radix-select-content]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Request</DialogTitle>
          <DialogDescription>
            Enter the details for the new request. Fields marked with * are required.
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

              {/* Request Type */}
              <FormField
                control={form.control}
                name="requestTypeId"
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
                        {requestTypes.length === 0 ? (
                          <div className="p-2 text-center text-sm text-gray-500">
                            No request types found. Create one first.
                          </div>
                        ) : (
                          requestTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                {type.color && (
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: type.color }}
                                  />
                                )}
                                {type.displayName}
                              </div>
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
                        {requestEnums.poStatus.map((poStatus) => (
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
                        {requestEnums.paymentStatus.map((paymentStatus) => (
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

              {/* Description */}
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
                        {requestEnums.requestStatus.map((requestStatus) => (
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
                        {requestEnums.tsiConfirm.map((tsiConfirm) => (
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

              {/* store location */}
              <FormField
                control={form.control}
                name="storeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter store location" {...field} />
                    </FormControl>
                    <FormDescription>Store location</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* way bill type */}
              <FormField
                control={form.control}
                name="wayBillType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Way Bill Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select way bill type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requestEnums.wayBillType.map((wayBillType) => (
                          <SelectItem key={wayBillType} value={wayBillType}>
                            {wayBillType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Way bill type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* way bill number */}
              <FormField
                control={form.control}
                name="wayBillNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Way Bill Number</FormLabel>
                    <FormControl>
                      <Input placeholder={getWayBillNumberPlaceholder(form.getValues("wayBillType") as WayBillType)} {...field} />
                    </FormControl>
                    <FormDescription>Way bill number</FormDescription>
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
