import { Grid } from "../components/Grid"
import { NavBar } from "../components/NavBar"
import { SignUpModal } from "../components/SignUpModal"
import { ErrorBlob } from "../components/ErrorBlob";
import { useRecoilValue } from "recoil";
import { errorStateAtom } from "../store/atoms/errorState";

export function SignUp(){

    const errorState = useRecoilValue(errorStateAtom);

    return (
        <>
          <div className="w-screen overflow-hidden h-screen bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(121,118,118,0.3),rgba(255,255,255,0))]">
            <Grid />
            <NavBar />
            <div className="flex h-full items-center justify-center">
                <SignUpModal />
            </div>
            <ErrorBlob message={errorState.text} />
          </div>
        </>
      );  
}