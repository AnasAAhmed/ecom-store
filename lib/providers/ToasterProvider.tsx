import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return <Toaster toastOptions={{style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },}} position="bottom-right"/>;
}

export default ToasterProvider;