import React, { Component } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageApi } from 'components/services/api';
import Searchbar from 'components/searchBar/searchBar';
import ImageGaleery from 'components/imageGallery/imageGallery';
import LoadMoreBtn from 'components/button/button';
import Modal from 'components/modal/modal';
import Loader from 'components/loader/loader';

class App extends Component {
  state = {
    searchQuery: '',
    currentPage: 1,
    images: [],
    totalHits: 0,
    largeImg: '',
    loading: false,
    error: null,
    showModal: false,
    perPage: 12,
  };

  componentDidUpdate(_, prevState) {
    const { searchQuery, currentPage, perPage } = this.state;

    if (searchQuery !== prevState.searchQuery) {
      this.setState({ loading: true, images: [] });
      ImageApi({ searchQuery, currentPage, perPage })
        .then(({ hits, totalHits }) =>
          this.setState({
            images: hits,
            totalHits: totalHits,
          })
        )
        .catch(error => this.setState({ error }))
        .finally(() => this.setState({ loading: false }));
    }

    if (
      prevState.currentPage !== this.state.currentPage &&
      this.state.currentPage !== 1
    ) {
      this.setState({ loading: true });
      ImageApi({ searchQuery, currentPage, perPage })
        .then(({ hits }) => {
          this.setState(prevState => ({
            images: [...prevState.images, ...hits],
          }));
        })
        .catch(error => this.setState({ error }))
        .finally(() => this.setState({ loading: false }));
    }
  }

  getlargeImage = largeImageURL => {
    this.setState({
      showModal: true,
      largeImg: largeImageURL,
    });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleFormSubmit = value => {
    this.setState({
      searchQuery: value,
      currentPage: 1,
    });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  render() {
    const { images, loading, showModal, largeImg, totalHits } = this.state;

    return (
      <div>
        {showModal && (
          <Modal onClose={this.handleCloseModal}>
            <img src={largeImg} alt="" width="900" height="600" />
          </Modal>
        )}
        <ToastContainer autoClose={1000} />

        <Searchbar onSubmit={this.handleFormSubmit} />

        {loading && <Loader />}

        <ImageGaleery params={images} bigImage={this.getlargeImage} />

        {totalHits > images.length > 0 && (
          <LoadMoreBtn onClick={this.handleLoadMore} title="Load more" />
        )}
      </div>
    );
  }
}

export default App;
