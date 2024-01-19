import ContactsTable from "./components/ContactsTable";
import Icon from "./assets/icon.svg";
import "./App.css"

function App() {
  return (
    <div className="text-center">
       <div className="cropped-image-container">
        <img style={{width:"400px"}} alt="Hotspot Updates" src={Icon} />
      </div>
    
      <ContactsTable />

    </div>
  );
}

export default App;