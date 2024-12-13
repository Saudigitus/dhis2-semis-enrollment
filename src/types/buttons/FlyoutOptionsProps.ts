interface FlyoutComponentProps {
    options: FlyoutOptionsProps[]
}

interface FlyoutOptionsProps {
    label: any
    divider: boolean
    disabled: boolean
}

export type { FlyoutOptionsProps, FlyoutComponentProps }
