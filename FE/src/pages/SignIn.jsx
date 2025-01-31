import { Grid } from "../components/Grid"
import { NavBar } from "../components/NavBar"
import { SignInModal } from "../components/SignInModal"
import { useRecoilValue } from "recoil";
import { errorStateAtom } from "../store/atoms/errorState";
import { ErrorBlob } from "../components/ErrorBlob";

export function SignIn(){

    const errorState = useRecoilValue(errorStateAtom);

    return (
        <>
          <div className="w-screen overflow-hidden h-screen bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(121,118,118,0.3),rgba(255,255,255,0))]">
            <Grid />
            <NavBar />
            <div className="flex h-full items-center justify-center">
                <SignInModal />
            </div>
            <ErrorBlob message={errorState.text} />
          </div>
        </>
      );
      
}