
export function UploadSampleForm() {

    const handleFileUpload = (e: any) => {
        const fileHandle = e.target.files[0]

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(fileHandle)

        fileReader.onloadend = (e: any) => {
            console.log(e.target.result)
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
        </div>
    )
}