import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const handleViewImage = (url: string) => {
    setCurrentImageUrl(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={{ sm: 1, md:2, lg: 3 }} gap='40px'>
        {cards.map(card => <Card key={card.id} data={card} viewImage={handleViewImage} />)}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={currentImageUrl}/>
    </>
  );
}
