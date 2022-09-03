import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        w='auto'
        maxW='900px'
        maxH='600px'
      >
        <ModalBody p={0}>
          <Image src={imgUrl} />
        </ModalBody>

        <ModalFooter
          bg='pGray.800'
          borderBottomRadius='5px'
          h={8}
          paddingX={2.5}
          paddingY={2}
        >
          <Link
            href={imgUrl}
            isExternal
            marginRight='auto'
            fontSize='0.875rem'
          >
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
