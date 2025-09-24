interface ModalContentInterface {
    formFields: any
    loading: boolean
    onCancel: () => void
    onSubmit: (arg: any) => void
    onChange: (arg: any) => void
    formValues?: Record<string, any>
    initialValues?: Record<string, any>
    setFormValues?: (arg: any) => void
}

interface ModalManagerInterface {
    open: boolean;
    formFields?: any;
    formVariablesFields?: any
    saveMode: "CREATE" | "UPDATE";
    setOpen: (arg: boolean) => void;
    initialValues?: Record<string, any>
    setFormInitialValues?: (arg: Record<string, any>) => void;
}

export type { ModalContentInterface, ModalManagerInterface }