interface ModalContentInterface {
    formFields: any
    loading: boolean
    onCancel: () => void
    onSubmit: (arg: any) => void
    onChange: (arg: any) => void
    formValues?: Record<string, any>
    initialValues?: Record<string, any>
}

interface ModalManagerInterface {
    open: boolean;
    formFields?: any;
    saveMode: "CREATE" | "UPDATE";
    setOpen: (arg: boolean) => void;
    initialValues?: Record<string, any>
}

export type { ModalContentInterface, ModalManagerInterface }