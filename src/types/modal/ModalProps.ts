interface ModalContentInterface {
    formFields: any
    loading: boolean
    onCancel: () => void
    onSubmit: (arg: any) => void
    onChange: (arg: any) => void
    initialValues?: Record<string, any>
}

interface ModalManagerInterface {
    open: boolean;
    saveMode: "CREATE" | "UPDATE";
    setOpen: (arg: boolean) => void;
}

export type { ModalContentInterface, ModalManagerInterface }