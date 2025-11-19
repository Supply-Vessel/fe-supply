import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/src/components/ui/form";
import { ParameterDialog } from "@/src/components/requests/parameter-dialog";
import { Calendar, Clock, Plus, Trash, Upload } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import { Textarea } from "@/src/components/ui/textarea";
import type { MeasurementsViewProps } from "./types";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";

export default function MeasurementsView({
        setOpenParameterDialog,
        handleUpdateParameter,
        additionalParameters,
        openParameterDialog,
        handleAddParameter,
        handleSubmit,
        animalEnums,
        animalId,
        router,
        userId,
        labId,
        form,
    }: MeasurementsViewProps) {
    return (
        <>
            <div className="container mx-auto p-4 md:p-6">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Link href={`/${labId}/requests/${animalId}`}>
                            <Button 
                                onClick={() => {
                                    router.back()
                                }}
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Request
                            </Button>
                        </Link>
                        <Separator orientation="vertical" className="h-6" />
                        <h1 className="text-2xl font-bold">New Measurement</h1>
                    </div>
            
                    <Card>
                        <CardHeader>
                        <CardTitle>Record Measurement</CardTitle>
                        <CardDescription>Record new measurements and observations for request {animalId}</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                                {/* Record Type and Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="recordType"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Record Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                    <SelectValue placeholder="Select record type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {animalEnums?.recordType.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                    ))}
                                                </SelectContent>
                                                </Select>
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="recordDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date</FormLabel>
                                                        <Input
                                                            id="date"
                                                            type="date"
                                                            defaultValue={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                    
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="recordTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Time</FormLabel>
                                                        <Input
                                                            id="time"
                                                            type="time"
                                                            defaultValue={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                
                                {/* Standard Parameters */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Standard Parameters</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Weight (g)</FormLabel>
                                                        <Input
                                                            id="weight"
                                                            type="number"
                                                            placeholder="Enter weight"
                                                            value={field.value?.toString() || ""}
                                                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                         </div>
                    
                                         <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="temperature"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Temperature (°C)</FormLabel>
                                                        <Input
                                                            id="temperature"
                                                            type="number"
                                                            placeholder="Enter temperature"
                                                            value={field.value?.toString() || ""}
                                                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                         </div>
                    
                                         <div className="space-y-2">
                                             <FormField
                                                control={form.control}
                                                name="waterIntake"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Water Intake (ml)</FormLabel>
                                                        <Input
                                                            id="water-intake"
                                                            type="number"
                                                            placeholder="Enter water intake"
                                                            value={field.value?.toString() || ""}
                                                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                        />
                                                    </FormItem>
                                                )}
                                             />
                                         </div>
                    
                                         <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="feedIntake"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Feed Intake (g)</FormLabel>
                                                        <Input
                                                            id="feed-intake"
                                                            type="number"
                                                            placeholder="Enter feed intake"
                                                            value={field.value?.toString() || ""}
                                                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                         </div>
                    
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="activityLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Activity Level</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                            <SelectValue placeholder="Select record type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {animalEnums?.activityLevel.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                
                                {/* Additional Parameters */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium">Additional Parameters</h3>
                                        <Button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setOpenParameterDialog(true);
                                            }} 
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Parameter
                                        </Button>
                                    </div>
                
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {additionalParameters.map((parameter, index) => (
                                            <div key={parameter.parameterName} className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`measurements.${index}.parameterValue`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{parameter.parameterName} {parameter.parameterUnit ? `(${parameter.parameterUnit})` : ""}</FormLabel>
                                                            <Input
                                                                id={parameter.parameterName}
                                                                type="number"
                                                                placeholder="Enter value"
                                                                value={parameter.parameterValue || field.value || ""}
                                                                onChange={(e) => {
                                                                    field.onChange(Number(e.target.value));
                                                                    handleUpdateParameter(index, Number(e.target.value));
                                                                }}
                                                            />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                
                                {/* Photo Upload */}
                                {/* <div>
                                    <h3 className="text-lg font-medium mb-4">Photos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                            <div className="bg-gray-100 rounded-full p-3 mb-2">
                                                <Upload className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <p className="text-sm font-medium mb-1">Drag and drop files here</p>
                                            <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                                            <Button type="button" variant="outline" size="sm">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Photo
                                            </Button>
                                            <input type="file" className="hidden" accept="image/*" />
                                        </div>
                    
                                        <div className="border rounded-lg p-4">
                                            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-3">
                                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-500 text-center">Photo preview will appear here</p>
                                        </div>
                                    </div>
                                </div> */}
                
                                {/* Notes */}
                                <div className="space-y-2"> 
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <Textarea 
                                                    id="notes"
                                                    placeholder="Enter any additional observations or notes"
                                                    className="min-h-[120px]"
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                
                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3">
                                    <Link href={`/${labId}/requests/${animalId}`}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit">Save Measurement</Button>
                                </div>
                            </form>
                        </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {/* Parameter Dialog*/}
            <ParameterDialog
                loadingButtonText="Adding Parameter"
                submitButtonText="Add Parameter"
                setOpen={setOpenParameterDialog}
                onSubmit={handleAddParameter}
                open={openParameterDialog}
            />
        </>
    )
}