import { useState } from "react";
import { Image, Transformation } from "cloudinary-react";
import { api } from "../../utils/constants";
import AccountAvatarModal from "./AccountAvatarModal";

const AccountAvatar = ({ secure_url, public_id, fullName }) => {
  // Component state
  const [showModal, setModalShow] = useState(false);
  const [state, setState] = useState({
    secure_url,
    public_id,
  });

  const handleAvatarClick = () => setModalShow(!showModal);

  return (
    <div className="d--flex-center m--y-1">
      <div className="d--flex-center w--100 shadow p--2 brad">
        <Image
          cloudName={api.cloudinaryName}
          publicId={state.public_id}
          className="img--avatar click--cursor"
          onClick={handleAvatarClick}
          alt={`${fullName}'s avatar`}
          height="120"
          width="120"
        >
          <Transformation gravity="faces" quality="auto" />
        </Image>
        <br />
        <span className="text--info">Click image to change or remove</span>
      </div>

      {showModal && (
        <AccountAvatarModal
          toggle={setModalShow}
          initValues={{
            secure_url: state.secure_url,
            public_id: state.public_id,
            setState,
          }}
        />
      )}
    </div>
  );
};

export default AccountAvatar;
