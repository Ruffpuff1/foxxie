import { useContext } from 'react';
import { MdPeople } from 'react-icons/md';
// import { SharedModalContext } from 'src/utils/SharedModalContext';
import { Folder } from 'src/hooks/useFolder';

export default function SharedPeopleButton({ currentFolder }: Props) {
    // const { setShowModal } = useContext(SharedModalContext);

    return Boolean(currentFolder?.sharedUsers?.length) ? (
        <div>
            <button
                onClick={() => {
                    //  setShowModal(true);
                }}
                className='rounded-full p-2 duration-500 hover:bg-gray-200'
            >
                <MdPeople className='text-xl' />
            </button>
        </div>
    ) : null;
}

interface Props {
    currentFolder: Folder | null;
}
