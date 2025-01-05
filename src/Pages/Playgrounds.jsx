
import ChatNowHeader from '../Component/ChatNowHeader';
import { useUser } from '../Component/UserContext';
function Playgrounds() {
    const { userId } = useUser();
    console.log("first user:", userId);
  return (
    <div>
      <ChatNowHeader/>
      
    </div>
  )
}

export default Playgrounds