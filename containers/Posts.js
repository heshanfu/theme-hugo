import React, { Component } from "react";
import ArticleListItem from "../components/Post/ArticleListItem";
import Loader from "../components/Loader";
import config from "../../../../config";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";
import WithResize from "./Hoc/WithResize";
import PostsData from "shared/data-connectors/PostsData";
import Pagination from "../styled/Pagination";
import HeroImage from "../components/HeroImage";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.page = 1;
        this.state = {
            posts: [],
            loading: true
        };
    }

    componentDidMount() {
        document.body.classList.add("posts-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("posts-page");
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.loading && prevState.loading) {
            nextProps.setHeroDetails({
                image: nextProps.settings.banner.value,
                title: nextProps.settings.site_title.value,
                subTitle: nextProps.settings.site_tagline.value
            });
            return {
                loading: false
            };
        }
        return null;
    }

    async loadMore(num) {
        let result = await this.props.fetchMore({
            type: "post_category",
            slug: this.props.slug || this.props.match.params.slug,
            postType: "post",
            limit: config.itemsPerPage,
            offset: (num - 1) * config.itemsPerPage
        });
        this.page = num;
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.posts) {
            return (
                <OhSnap message={this.props.settings.search_notFound.value} />
            );
        }
        if (this.props.posts.length === 0) {
            return (
                <OhSnap message={this.props.settings.text_posts_empty.value} />
            );
        }
        const articles = this.props.posts.map((post, i) => {
            return <ArticleListItem idx={i} key={i} post={post} />;
        });

        return (
            <section className="main post-list">
                <HeroImage
                    image={config.baseName + this.props.settings.banner.value}
                    display={this.props.settings.banner.value.length > 0}
                />
                {articles}
                <Pagination className="pagination-wrapper">
                    <Paginate
                        count={this.props.total}
                        match={this.props.match}
                        page={this.page}
                        loadMore={this.loadMore}
                    />
                </Pagination>
            </section>
        );
    }
}

export default PostsData(Posts);
