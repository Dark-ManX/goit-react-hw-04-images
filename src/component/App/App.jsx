import { useEffect, useReducer } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import fetchRes from '../additional/fetchFunc/fetchFunc';
import { Container, Button, DisabledBtn } from './App.styled';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PENDING':
      return { ...state, status: action.payload };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'resolved',
        gallery: [...state.gallery, ...action.payload.gallery],
        page: state.page + action.payload.page,
        disabled: action.payload.disabled,
      };

    case 'FETCH_ERROR':
      return { ...state, status: action.payload };

    case 'SET_SEARCH':
      return { ...state, search: action.payload, gallery: [], page: 1 };

    case 'LOAD_MORE':
      return {
        ...state,
        loadMoreClicked: state.page,
      };

    case 'OPEN_MODAL':
      return { ...state, ...action.payload };

    case 'CLOSE_MODAL':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const obj = {
  search: '',
  page: 1,
  loadMoreClicked: 0,
  gallery: [],
  total: null,
  error: null,
  status: 'none',
  img: null,
  alt: '',
  showModal: false,
  disabled: false,
  perPage: 12,
};

const App = () => {
  const [initialValue, dispatch] = useReducer(reducer, obj);

  useEffect(() => {
    const { search, page, perPage } = initialValue;

    if (!search) {
      return;
    }

    const setPending = () => dispatch({ type: 'FETCH_PENDING', payload: 'pending' });
    setPending();

    fetchRes(search, page, perPage)
      .then(({ totalHits, hits }) =>
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            gallery: [...hits],
            page: 1,
            status: 'resolved',
            disabled: page === Math.ceil(totalHits / perPage),
          },
        }),
      )
      .catch(error => dispatch({ type: 'FETCH_ERROR', payload: 'rejected' }));
  }, [initialValue.search, initialValue.loadMoreClicked]);

  const handleSearch = text => {
    dispatch({ type: 'SET_SEARCH', payload: text });
  };

  const handleClick = ind => {
    const [image] = initialValue.gallery.filter(el => el.id === ind);

    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        showModal: true,
        img: image.largeImageURL,
        alt: image.tags,
      },
    });
    //     });
  };

  const { status, gallery, disabled, showModal, img, alt } = initialValue;
  // const handleClose = () => {}
  //   ;
  // };
  console.log(initialValue.img);
  return (
    <Container>
      <Searchbar onSearch={handleSearch} />

      {status === 'rejected' && <p>Information not found</p>}

      {status === 'resolved' && (
        <>
          <ImageGallery gallery={gallery} onClick={handleClick} />

          {!disabled ? (
            <Button onClick={() => dispatch({ type: 'LOAD_MORE', payload: 1 })} type="button">
              Load more
            </Button>
          ) : (
            <DisabledBtn type="button" disabled>
              Load more
            </DisabledBtn>
          )}

          {showModal && (
            <Modal
              children={<img src={img} alt={alt} />}
              onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { showModal: false } })}
            />
          )}
        </>
      )}

      {status === 'pending' && <Loader />}
    </Container>
  );
};

export default App;
