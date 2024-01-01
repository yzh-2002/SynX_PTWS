import UESTCLogo from "@/assets/uestc_logo.svg?react"
// import UESTCLogoWithTitle from "@/assets/uestc_logo_title.svg?react"


function Logo() {
    return (
        <div>
            <UESTCLogo className="w-12 h-12 mr-2" />
            {/* <UESTCLogoWithTitle className="w-[190] h-12" /> */}
        </div>
    )
}

export default Logo