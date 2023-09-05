import { ShellBar } from "@ui5/webcomponents-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { Details } from "./Details";
import { Home } from "./Home";

function App() {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <>
      <ShellBar
        primaryTitle="Movie DB"
        logo={
          <img
            src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg"
            alt="SAP Logo"
          />
        }
        onLogoClick={handleLogoClick}
      />
      <div style={{ height: "calc(100% - 44px)", overflow: "auto" }}>
        <Routes>
          <Route path="details/:movieId" element={<Details />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
