import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, FieldError, FormState, FieldValues } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageUploadedProps {
  size: number;
  type: string;
}

interface ImageFormRecord {
  url: string,
  title: string;
  description: string;
}

interface ImageFormSubmit {
  description: string;
  title: string;
}

interface FormStateCustom extends FormState<FieldValues> {
  errors: ReactHookError;
}

interface ReactHookError {
  [x: string]: FieldError;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const supportedExtensions = new RegExp('^(image\/(png|jpeg|jpg|png|gif))$');

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: (images: ImageUploadedProps[]) =>
          images.length && images[0].size < 10485760
          || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: (images: ImageUploadedProps[]) =>
          images.length && supportedExtensions.test(images[0].type)
          || 'Somente são aceitos arquivos PNG, JPEG e GIF',
      }
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      }
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(async (image: ImageFormRecord) => {
      const response = await api.post('/api/images', image);
      return response.data.image;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } = useForm();
  const { errors } = formState as FormStateCustom;

  const onSubmit = async (data: ImageFormSubmit): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          id: '8f5babcf-a2ff-49c0-bfa5-6387dd6e6bd2',
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          isClosable: true,
          status: 'warning'
        });
        return;
      }

      mutation.mutateAsync({
        description: data.description,
        url: imageUrl,
        title: data.title,
      })

      toast({
        id: '8f5babcf-a2ff-49c0-bfa5-6387dd6e6bd2',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        isClosable: true,
        status: 'success'
      });
    } catch {
      toast({
        id: '8f5babcf-a2ff-49c0-bfa5-6387dd6e6bd2',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        isClosable: true,
        status: 'error'
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
