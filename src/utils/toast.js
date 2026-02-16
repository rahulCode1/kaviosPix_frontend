import { toast } from "react-toastify"
export const loadingToast = message => {
    return toast.loading(message)
}


export const toastSuccess = (toastId, message) => {
    return toast.update(toastId, {
        type: 'success',
        autoClose: 3000,
        render: message,
        isLoading: false

    })
}


export const toastError = (toastId, message) => {
    return toast.update(toastId, {
        type: 'error',
        autoClose: 3000,
        render: message,
        isLoading: false

    })
}

export const toastAlert = (message)=>{
    return toast.info(message, {
        position: 'top-right',
         autoClose: 3000,
    })

}