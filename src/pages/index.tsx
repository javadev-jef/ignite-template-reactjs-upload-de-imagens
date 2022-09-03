import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImageData {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImageDataResponse {
  after: string;
  data: ImageData[];
}

export default function Home(): JSX.Element {

  const getImages = async ({ pageParam = null }): Promise<ImageDataResponse> => {
    const { data } = await api.get<ImageDataResponse>('/api/images', { params: { after: pageParam } });
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, {
      getNextPageParam: (dataResponse) => {
        return dataResponse?.after || null;
      }
    }
  );

  const formattedData = useMemo(() => {
    const newData = data?.pages.flatMap(pageData => {
      return pageData.data.flat();
    });

    return newData;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        { hasNextPage && (
          <Button onClick={() => fetchNextPage()} marginTop='2.5rem' disabled={isFetchingNextPage}>
            { isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
          )
        }
      </Box>
    </>
  );
}
