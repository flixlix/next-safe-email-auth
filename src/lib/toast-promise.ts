import { toast } from "sonner"

export function toastPromise<T>(
  promise: Promise<T>,
  args: Parameters<(typeof toast)["promise"]>[1] & {
    success: string | React.ReactNode
    error: string | React.ReactNode
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    toast.promise(promise, {
      ...args,
      success: (data) => {
        resolve(data)
        return args.success
      },
      error: (err) => {
        reject(err)
        return args.error
      },
    })
  })
}
