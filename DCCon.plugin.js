/**
 * @name DCCon
 * @description 디스코드에서 디시콘을 쉽게 사용할 수 있게 도와주는 플러그인입니다.
 * @version 2.0.0
 * @author minibox
 * @authorId 310247242546151434
 * @website https://github.com/minibox24/DCCon2
 * @source https://github.com/minibox24/DCCon2
 */

// Reference: https://github.com/Dastan21/BDAddons/blob/main/plugins/FavoriteMedia/FavoriteMedia.plugin.js

/* global BdApi */

const DCConBaseURL = "https://dcimg5.dcinside.com/dccon.php?no=";
const DCConProxyURL = "https://dccon-proxy.minibox.workers.dev/?no=";

const ManduIcon = (props) => {
  const size = props.size || "24px";

  return BdApi.React.createElement(
    "svg",
    {
      viewBox: "0 0 512 512",
      className: classes.icon.icon,
      "aria-hidden": "false",
      width: size,
      height: size,
    },
    BdApi.React.createElement("path", {
      transform: "translate(0,512) scale(0.1,-0.1)",
      fill: "currentColor",
      d: "M2490 4778 c-142 -20 -270 -116 -332 -248 -30 -65 -35 -70 -58 -65 -60 14 -195 17 -249 5 -179 -39 -278 -147 -360 -391 -26 -79 -30 -85 -72 -108 -341 -182 -501 -295 -723 -511 -340 -331 -569 -722 -654 -1120 -91 -420 -29 -784 190 -1112 74 -111 257 -298 373 -380 480 -339 1130 -509 1955 -509 733 0 1322 133 1785 401 148 86 244 159 365 280 169 167 278 341 344 545 119 368 71 803 -133 1220 -126 255 -278 462 -497 675 -222 216 -383 329 -723 511 -44 23 -45 26 -82 137 -21 63 -50 134 -65 159 -53 91 -150 164 -263 199 -56 18 -182 19 -245 3 -26 -6 -48 -10 -49 -8 -2 2 -18 35 -36 72 -61 126 -192 226 -316 242 -27 3 -59 7 -70 9 -11 2 -49 -1 -85 -6z m-470 -1163 c62 -32 92 -105 72 -174 -17 -55 -364 -396 -409 -403 -111 -16 -198 72 -178 179 6 32 32 64 173 207 92 92 181 177 197 187 36 23 105 25 145 4z m621 -8 c64 -42 70 -68 67 -284 -3 -177 -5 -194 -24 -220 -47 -63 -132 -84 -195 -47 -70 41 -74 54 -77 267 -2 168 0 196 15 227 26 50 76 80 133 80 32 0 58 -7 81 -23z m597 9 c15 -8 104 -92 199 -188 187 -189 198 -207 174 -288 -13 -45 -69 -96 -112 -102 -74 -11 -86 -4 -276 185 -192 189 -211 216 -200 284 8 46 30 79 70 103 38 24 106 26 145 6z",
    })
  );
};

const plugin = BdApi.Plugins.get("DCCon");

const Dispatcher = BdApi.Webpack.getByKeys("dispatch", "subscribe");
const LocaleStore = BdApi.Webpack.getByKeys("locale", "initialize");
const EPS = {};
const EPSModules = BdApi.Webpack.getModule((m) =>
  Object.keys(m).some((key) =>
    m[key]?.toString?.().includes("isSearchSuggestion")
  )
);
const EPSConstants = BdApi.Webpack.getModule(
  BdApi.Webpack.Filters.byKeys("FORUM_CHANNEL_GUIDELINES", "CREATE_FORUM_POST"),
  { searchExports: true }
);
const ChannelTextArea = BdApi.Webpack.getModule((m) =>
  m?.type?.render?.toString?.()?.includes?.("CHANNEL_TEXT_AREA")
);
const Permissions = BdApi.Webpack.getByKeys("computePermissions");
const PermissionsConstants = BdApi.Webpack.getModule(
  BdApi.Webpack.Filters.byKeys("ADD_REACTIONS"),
  { searchExports: true }
);
const FilesUpload = BdApi.Webpack.getModule(
  BdApi.Webpack.Filters.byKeys("addFiles")
);

const classModules = {
  icon: BdApi.Webpack.getByKeys("icon", "active", "buttonWrapper"),
  menu: BdApi.Webpack.getByKeys("menu", "labelContainer", "colorDefault"),
  result: BdApi.Webpack.getByKeys("result", "emptyHints", "emptyHintText"),
  input: BdApi.Webpack.getByKeys("inputDefault", "inputWrapper", "inputPrefix"),
  role: BdApi.Webpack.getByKeys("roleCircle", "dot"),
  gif: BdApi.Webpack.getByKeys("icon", "gifFavoriteButton", "selected"),
  gif2: BdApi.Webpack.getByKeys(
    "container",
    "gifFavoriteButton",
    "embedWrapper"
  ),
  file: BdApi.Webpack.getByKeys("size", "file", "fileInner"),
  image: BdApi.Webpack.getByKeys("clickable", "imageWrapper", "imageAccessory"),
  control: BdApi.Webpack.getByKeys("container", "labelRow", "control"),
  category: BdApi.Webpack.getByKeys(
    "container",
    "categoryFade",
    "categoryName"
  ),
  textarea: BdApi.Webpack.getByKeys(
    "channelTextArea",
    "buttonContainer",
    "button"
  ),
  gutter: BdApi.Webpack.getByKeys("header", "backButton", "searchHeader"),
  horizontal: BdApi.Webpack.getByKeys("flex", "flexChild", "horizontal"),
  flex: BdApi.Webpack.getByKeys("flex", "alignStart", "alignEnd"),
  title: BdApi.Webpack.getByKeys("title", "h1", "h5"),
  container: BdApi.Webpack.getByKeys("container", "inner", "pointer"),
  scroller: BdApi.Webpack.getByKeys("disableScrollAnchor", "thin", "fade"),
  look: BdApi.Webpack.getByKeys("button", "lookBlank", "colorBrand"),
  contentWrapper: BdApi.Webpack.getByKeys(
    "contentWrapper",
    "nav",
    "positionLayer"
  ),
};

const classes = {
  icon: {
    icon: classModules.icon.icon,
    active: classModules.icon.active,
    button: classModules.icon.button,
    buttonWrapper: classModules.icon.buttonWrapper,
  },
  textarea: {
    channelTextArea: classModules.textarea.channelTextArea,
    buttonContainer: classModules.textarea.buttonContainer,
    button: classModules.textarea.button,
  },
  look: {
    button: classModules.look.button,
    lookBlank: classModules.look.lookBlank,
    colorBrand: classModules.look.colorBrand,
    grow: classModules.look.grow,
    contents: classModules.look.contents,
  },
  gutter: {
    header: classModules.gutter.header,
    backButton: classModules.gutter.backButton,
    searchHeader: classModules.gutter.searchHeader,
    searchBar: classModules.gutter.searchBar,
    content: classModules.gutter.content,
    container: classModules.gutter.container,
  },
  flex: {
    flex: classModules.horizontal.flex,
    horizontal: classModules.horizontal.horizontal,
    justifyStart: classModules.flex.justifyStart,
    alignCenter: classModules.flex.alignCenter,
    noWrap: classModules.flex.noWrap,
  },
  container: {
    container: classModules.container.container,
    medium: classModules.container.medium,
    inner: classModules.container.inner,
    input: classModules.container.input,
    iconLayout: classModules.container.iconLayout,
    iconContainer: classModules.container.iconContainer,
    pointer: classModules.container.pointer,
    clear: classModules.container.clear,
    visible: classModules.container.visible,
  },
  contentWrapper: {
    contentWrapper: classModules.contentWrapper.contentWrapper,
  },
  scroller: {
    thin: classModules.scroller.thin,
    fade: classModules.scroller.fade,
    content: classModules.scroller.content,
  },
};

let currentChannelId = "";
let canClosePicker = { context: "", value: true };
let closeExpressionPickerKey = "";

// 다국어 처리를 위한 번역 리소스
const translations = {
  en: {
    // English
    search: "Search for DCCons",
    addDccons: "Add DCCons in the plugin settings!",
    recent: "Recent",
    settings: {
      addDccon: "Add DCCon",
      remove: "Remove",
      added: "Added",
      adding: "Adding...",
      noResults: "No results",
      searchDccon: "Search for DCCon",
    },
    contextMenu: {
      edit: "Edit",
      download: "Download",
      copyColor: "Copy Color",
      moveTo: "Move To",
      addTo: "Add To",
      removeFrom: "Remove From Category",
      setThumbnail: "Set as Thumbnail",
      unsetThumbnail: "Unset Thumbnail",
      delete: "Delete",
    },
    media: {
      placeholder: "DCCon name",
      removeFrom: "Remove from category",
      emptyHint: "Click the star in the corner of a DCCon to favorite it!",
      upload: {
        title: "Upload",
        normal: "Normal",
        spoiler: "Spoiler",
      },
      controls: {
        show: "Show controls",
        hide: "Hide controls",
      },
    },
  },
  ko: {
    // Korean
    search: "디시콘 검색하기",
    addDccons: "플러그인 설정에서 디시콘을 추가해보세요!",
    recent: "최근 사용",
    settings: {
      addDccon: "디시콘 추가",
      remove: "제거",
      added: "추가됨",
      adding: "추가 중...",
      noResults: "검색 결과가 없습니다",
      searchDccon: "디시콘 검색",
    },
    contextMenu: {
      edit: "수정",
      download: "다운로드",
      copyColor: "색상 복사",
      moveTo: "이동",
      addTo: "추가",
      removeFrom: "카테고리에서 제거",
      setThumbnail: "썸네일로 설정",
      unsetThumbnail: "썸네일 해제",
      delete: "삭제",
    },
    media: {
      placeholder: "디시콘 이름",
      removeFrom: "카테고리에서 제거",
      emptyHint: "디시콘 모서리의 별표를 클릭하여 즐겨찾기에 추가하세요!",
      upload: {
        title: "업로드",
        normal: "일반",
        spoiler: "스포일러",
      },
      controls: {
        show: "컨트롤 표시",
        hide: "컨트롤 숨기기",
      },
    },
  },
};

// 현재 사용자 언어에 맞는 문자열 가져오기
function getLocaleStrings() {
  const locale = LocaleStore.locale?.toLowerCase() || "en";
  const language = locale.split("-")[0];
  return translations[language] || translations.en;
}

// 디시콘 API 관련 함수
const getDCCon = (idx) => {
  return new Promise((resolve, reject) => {
    BdApi.Net.fetch("https://dccon.dcinside.com/index/package_detail", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: `package_idx=${idx}`,
    })
      .then((r) => r.text())
      .then((body) => {
        const original = JSON.parse(body);

        const info = {
          package_idx: original.info.package_idx,
          title: original.info.title,
          main_img_path: original.info.main_img_path,
          list_img_path: original.info.list_img_path,
        };

        const detail = original.detail.map((x) => {
          return { idx: x.idx, title: x.title, ext: x.ext, path: x.path };
        });

        resolve({ info, detail });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// DCCon 버튼 컴포넌트
class DCConButton extends BdApi.React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.changeActive = this.changeActive.bind(this);
    this.checkPicker = this.checkPicker.bind(this);
  }

  get isActive() {
    const EPSState = EPS.useExpressionPickerStore.getState();
    return EPSState.activeView === "dccon";
  }

  changeActive() {
    if (this.isActive) {
      currentChannelId = this.props.channelId;
    }
    this.setState({ active: this.isActive });
  }

  checkPicker() {
    const EPSState = EPS.useExpressionPickerStore.getState();
    canClosePicker.context = "dcconbutton";
    canClosePicker.value = EPSState.activeView == null;
  }

  componentDidMount() {
    Dispatcher.subscribe("DCCON_PICKER_BUTTON_ACTIVE", this.changeActive);
  }

  componentWillUnmount() {
    Dispatcher.unsubscribe("DCCON_PICKER_BUTTON_ACTIVE", this.changeActive);
  }

  render() {
    return BdApi.React.createElement(
      "div",
      {
        className: `${classes.textarea.buttonContainer} dccon-buttonContainer`,
        ref: "button",
      },
      BdApi.React.createElement(
        "button",
        {
          className: `${classes.look.button} ${classes.look.lookBlank} ${
            classes.look.colorBrand
          } ${classes.look.grow}${
            this.state.active ? ` ${classes.icon.active}` : ""
          } dccon-button`,
          tabIndex: "0",
          type: "button",
          onMouseDown: this.checkPicker,
          onClick: () => {
            const EPSState = EPS.useExpressionPickerStore.getState();
            if (
              EPSState.activeView === "dccon" &&
              EPSState.activeViewType?.analyticsName !==
                this.props.pickerType?.analyticsName
            ) {
              EPS.toggleExpressionPicker(
                "dccon",
                this.props.pickerType ?? EPSState.activeViewType
              );
            }
            EPS.toggleExpressionPicker(
              "dccon",
              this.props.pickerType ?? EPSConstants.NORMAL
            );
          },
        },
        BdApi.React.createElement(
          "div",
          {
            className: `${classes.look.contents} ${classes.textarea.button} ${classes.icon.button} dccon-buttonContent`,
          },
          BdApi.React.createElement(
            "div",
            {
              className: `${classes.icon.buttonWrapper} dccon-buttonWrapper`,
              style: { opacity: "1", transform: "none" },
            },
            BdApi.React.createElement(ManduIcon)
          )
        )
      )
    );
  }
}

// #region DCConPanel

// 디시콘 이미지를 가져오는 함수
const getDCConImage = (con) => {
  return new Promise((resolve, reject) => {
    BdApi.Net.fetch(DCConBaseURL + con.path, {
      responseType: "arraybuffer",
      headers: {
        Referer: "https://dcimg5.dcinside.com",
      },
    })
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const blob = new Blob([data], { type: `image/${con.ext}` });
        resolve(
          new File([blob], `dccon.${con.ext}`, { type: `image/${con.ext}` })
        );
      })
      .catch((err) => {
        BdApi.Logger.error("DCCon", "Failed to fetch DCCon image:", err);
        reject(err);
      });
  });
};

// 디시콘 메시지 전송 함수
const sendDCConMessage = async (con) => {
  try {
    const image = await getDCConImage(con);
    const channelId = currentChannelId;

    // 최근 사용 디시콘에 추가
    const recentCons = loadData("recent", []);
    if (!recentCons.some((c) => c.idx === con.idx)) {
      recentCons.unshift(con);
      if (recentCons.length > 20) recentCons.pop(); // 최대 20개까지 저장
      saveData("recent", recentCons);
      Dispatcher.dispatch({ type: "DCCON_RECENT_UPDATE" });
    }

    // 디시콘 파일 업로드
    if (!channelId) {
      BdApi.UI.showToast("현재 채널을 찾을 수 없습니다.", { type: "error" });
      return false;
    }

    FilesUpload.addFiles({
      channelId: channelId,
      draftType: 0,
      files: [{ file: image, platform: 1 }],
      showLargeMessageDialog: false,
    });

    // 필요하다면 Expression Picker 닫기
    const EPSState = EPS.useExpressionPickerStore.getState();
    if (EPSState.activeView === "dccon") {
      EPS.closeExpressionPicker();
    }

    return true;
  } catch (err) {
    BdApi.Logger.error("DCCon", "Failed to send DCCon:", err);
    BdApi.UI.showToast("디시콘 전송에 실패했습니다.", { type: "error" });
    return false;
  }
};

// 카테고리 컴포넌트
class DCConCategory extends BdApi.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  render() {
    const { dccon } = this.props;
    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      { className: "dccon-category" },
      BdApi.React.createElement(
        "div",
        {
          className: `dccon-category-header ${
            this.state.expanded ? "expanded" : "collapsed"
          }`,
          onClick: () =>
            this.setState((state) => ({ expanded: !state.expanded })),
        },
        BdApi.React.createElement("img", {
          src: DCConProxyURL + dccon.info.list_img_path,
          className: "dccon-category-icon",
        }),
        BdApi.React.createElement(
          "div",
          { className: "dccon-category-name" },
          dccon.info.title
        ),
        BdApi.React.createElement(
          "div",
          { className: "dccon-category-toggle" },
          BdApi.React.createElement(
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
            },
            BdApi.React.createElement("path", {
              fill: "var(--text-normal)",
              d: this.state.expanded
                ? "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                : "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
            })
          )
        )
      ),
      this.state.expanded &&
        BdApi.React.createElement(
          "div",
          { className: "dccon-items" },
          dccon.detail.map((con) =>
            BdApi.React.createElement(DCConItem, {
              key: con.idx,
              con: con,
              packageIdx: dccon.info.package_idx,
            })
          )
        )
    );
  }
}

// 디시콘 아이템 컴포넌트
class DCConItem extends BdApi.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  handleError() {
    this.setState({ error: true });
  }

  render() {
    const { con } = this.props;

    if (this.state.error) {
      return BdApi.React.createElement(
        "div",
        { className: "dccon-item dccon-item-error" },
        "이미지 로드 실패"
      );
    }

    return BdApi.React.createElement(
      "div",
      {
        className: "dccon-item",
        onClick: (e) => {
          sendDCConMessage({ ...con, packageIdx: this.props.packageIdx });
        },
      },
      BdApi.React.createElement("img", {
        src: DCConProxyURL + con.path,
        alt: con.title,
        loading: "lazy",
        onError: () => this.handleError(),
      })
    );
  }
}

// 최근 사용 디시콘 컴포넌트
class RecentDCCons extends BdApi.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      recentCons: loadData("recent", []),
    };
  }

  componentDidMount() {
    Dispatcher.subscribe("DCCON_RECENT_UPDATE", this.updateRecentCons);
  }

  componentWillUnmount() {
    Dispatcher.unsubscribe("DCCON_RECENT_UPDATE", this.updateRecentCons);
  }

  updateRecentCons = () => {
    this.setState({ recentCons: loadData("recent", []) });
  };

  render() {
    if (this.state.recentCons.length === 0) return null;

    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      { className: "dccon-category" },
      BdApi.React.createElement(
        "div",
        {
          className: `dccon-category-header ${
            this.state.expanded ? "expanded" : "collapsed"
          }`,
          onClick: () =>
            this.setState((state) => ({ expanded: !state.expanded })),
        },
        BdApi.React.createElement(
          "div",
          { className: "dccon-recent-icon" },
          BdApi.React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width: "24",
              height: "24",
            },
            BdApi.React.createElement("path", {
              fill: "currentColor",
              d: "M12 2C6.4764 2 2 6.4764 2 12C2 17.5236 6.4764 22 12 22C17.5236 22 22 17.5236 22 12C22 6.4764 17.5236 2 12 2ZM12 5.6C12.4422 5.6 12.8 5.95781 12.8 6.4V11.5376L16.5625 13.7126C16.9453 13.9329 17.0703 14.4173 16.85 14.8001C16.6297 15.183 16.1453 15.3079 15.7625 15.0876L11.6873 12.7376C11.656 12.7251 11.6279 12.7048 11.5998 12.6876C11.3607 12.5486 11.1998 12.2954 11.1998 12.0001V6.4001C11.1998 5.9579 11.5578 5.6 12 5.6Z",
            })
          )
        ),
        BdApi.React.createElement(
          "div",
          { className: "dccon-category-name" },
          strings.recent
        ),
        BdApi.React.createElement(
          "div",
          { className: "dccon-category-toggle" },
          BdApi.React.createElement(
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
            },
            BdApi.React.createElement("path", {
              fill: "currentColor",
              d: this.state.expanded
                ? "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                : "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
            })
          )
        )
      ),
      this.state.expanded &&
        BdApi.React.createElement(
          "div",
          { className: "dccon-items" },
          this.state.recentCons.map((con) =>
            BdApi.React.createElement(DCConItem, {
              key: con.idx,
              con: con,
              packageIdx: con.packageIdx,
            })
          )
        )
    );
  }
}

// 디시콘 패널 컴포넌트 업데이트
class DCConPanel extends BdApi.React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textFilter: "",
      dccons: loadData("dccons", []),
    };

    this.filterDccons = this.filterDccons.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    Dispatcher.dispatch({ type: "DCCON_PICKER_BUTTON_ACTIVE" });
  }

  componentWillUnmount() {
    Dispatcher.dispatch({ type: "DCCON_PICKER_BUTTON_ACTIVE" });
  }

  clearSearch() {
    if (this.refs.input) this.refs.input.value = "";
    this.setState({ textFilter: "" });
  }

  filterDccons() {
    if (!this.state.textFilter) return this.state.dccons;

    const query = this.state.textFilter.toLowerCase();

    return this.state.dccons.filter((dccon) => {
      // 디시콘 팩 제목 검색
      if (dccon.info.title.toLowerCase().includes(query)) return true;

      // 개별 디시콘 제목 검색
      return dccon.detail.some((con) =>
        con.title.toLowerCase().includes(query)
      );
    });
  }

  render() {
    if (this.props.type !== "dccon") {
      return null;
    }

    const strings = getLocaleStrings();
    const filteredDccons = this.filterDccons();

    return BdApi.React.createElement(
      "div",
      {
        id: "dccon-picker-tab-panel",
        "aria-labelledby": "dccon-picker-tab",
        role: "tabpanel",
        className: `${classes.gutter.container} dccon-pickerContainer`,
      },
      // 헤더
      BdApi.React.createElement(
        "div",
        {
          className: `${classes.gutter.header} dccon-header`,
        },
        BdApi.React.createElement(
          "div",
          {
            className: `${classes.flex.flex} ${classes.flex.horizontal} ${classes.flex.justifyStart} ${classes.flex.alignCenter} ${classes.flex.noWrap}`,
            style: { flex: "1 1 auto" },
          },
          BdApi.React.createElement(
            "div",
            {
              className: `${classes.gutter.searchBar} ${classes.container.container} ${classes.container.medium}`,
            },
            BdApi.React.createElement(
              "div",
              {
                className: classes.container.inner,
              },
              BdApi.React.createElement("input", {
                className: classes.container.input,
                placeholder: strings.search,
                autoFocus: true,
                ref: "input",
                onChange: (e) => {
                  this.setState({ textFilter: e.target.value });
                },
              }),
              BdApi.React.createElement(
                "div",
                {
                  className: `${classes.container.iconLayout} ${
                    classes.container.medium
                  } ${this.state.textFilter ? classes.container.pointer : ""}`,
                  tabIndex: "-1",
                  role: "button",
                  onClick: this.clearSearch,
                },
                BdApi.React.createElement(
                  "div",
                  {
                    className: classes.container.iconContainer,
                  },
                  BdApi.React.createElement(
                    "svg",
                    {
                      className: `${classes.container.clear} ${
                        this.state.textFilter
                          ? ""
                          : ` ${classes.container.visible}`
                      }`,
                      "aria-hidden": false,
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                    },
                    BdApi.React.createElement("path", {
                      fill: "currentColor",
                      d: "M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z",
                    })
                  ),
                  BdApi.React.createElement(
                    "svg",
                    {
                      className: `${classes.container.clear} ${
                        this.state.textFilter
                          ? ` ${classes.container.visible}`
                          : ""
                      }`,
                      "aria-hidden": false,
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                    },
                    BdApi.React.createElement("path", {
                      fill: "currentColor",
                      d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z",
                    })
                  )
                )
              )
            )
          )
        )
      ),
      // 콘텐츠
      BdApi.React.createElement(
        "div",
        {
          className: `${classes.gutter.content} dccon-pickerContent`,
        },
        BdApi.React.createElement(
          "div",
          {
            className: `dccon-scroller ${classes.scroller.thin} ${classes.scroller.fade}`,
          },
          BdApi.React.createElement(
            "div",
            {
              className: classes.scroller.content,
            },
            this.state.dccons.length === 0
              ? BdApi.React.createElement(
                  "div",
                  {
                    className: "dccon-empty-container",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    },
                  },
                  BdApi.React.createElement(
                    "span",
                    {
                      style: {
                        color: "#FFF",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      },
                    },
                    strings.addDccons
                  )
                )
              : BdApi.React.createElement("div", { className: "dccon-list" }, [
                  // 최근 사용 디시콘
                  BdApi.React.createElement(RecentDCCons, { key: "recent" }),

                  // 필터링된 디시콘 카테고리들
                  ...filteredDccons.map((dccon) =>
                    BdApi.React.createElement(DCConCategory, {
                      key: dccon.info.package_idx,
                      dccon: dccon,
                    })
                  ),
                ])
          )
        )
      )
    );
  }
}

// #endregion

function loadEPS() {
  if (EPSModules == null) {
    BdApi.Logger.warn(
      plugin.name,
      "Failed to load module ExpressionPickerStore"
    );
    return;
  }

  Object.entries(EPSModules).forEach(([key, fn]) => {
    const code = String(fn);
    if (fn.getState && fn.setState) {
      EPS.useExpressionPickerStore = fn;
    } else if (code.includes("activeView===")) {
      EPS.toggleExpressionPicker = fn;
    } else if (code.includes("activeView:null")) {
      EPS.closeExpressionPicker = fn;
      closeExpressionPickerKey = key;
    }
  });
}

function getOwnerInstance(
  node,
  {
    include,
    exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"],
    filter = (_) => _,
  } = {}
) {
  if (node === undefined) return undefined;
  const excluding = include === undefined;
  const nameFilter = excluding ? exclude : include;
  function getDisplayName(owner) {
    const type = owner.type;
    if (!type) return null;
    return type.displayName || type.name || null;
  }
  function classFilter(owner) {
    const name = getDisplayName(owner);
    return name !== null && !!(nameFilter.includes(name) ^ excluding);
  }

  let curr = BdApi.ReactUtils.getInternalInstance(node);
  for (curr = curr && curr.return; curr != null; curr = curr.return) {
    if (curr == null) continue;
    const owner = curr.stateNode;
    if (
      owner != null &&
      !(owner instanceof window.HTMLElement) &&
      classFilter(curr) &&
      filter(owner)
    )
      return owner;
  }

  return null;
}

// 관찰자 유틸리티 함수
function observe(selector, callback, options = {}, root = document) {
  if (typeof options.append === "function") {
    root = options;
    options = {};
  }
  const observer = new window.MutationObserver((_, instance) => {
    const el =
      root.querySelector(selector) ||
      root.matches?.(selector) ||
      root.matchesSelector?.(selector);
    if (el == null) return;
    callback?.(el, instance);
    if (!options.keep) instance.disconnect();
  });
  observer.observe(root, { childList: true, subtree: true, ...options });
  return observer;
}

// #region Settings
// 데이터 저장/로드 유틸리티 함수들
function loadData(key, defaultData) {
  defaultData = structuredClone(defaultData);

  const data = BdApi.Data.load("DCCon", key);
  if (data == null) return defaultData;

  // 기본값 처리
  for (const k in defaultData) {
    if (data[k] == null && defaultData[k] != null) {
      data[k] = defaultData[k];
    }
  }

  return data;
}

function saveData(key, data) {
  BdApi.Data.save("DCCon", key, data);
}

// 디시콘 검색 결과를 가져오는 함수
const getDCConSearchResult = (query) => {
  return new Promise((resolve, reject) => {
    BdApi.Net.fetch(
      encodeURI("https://dccon.dcinside.com/hot/1/title/" + query)
    )
      .then((r) => r.text())
      .then((body) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html");

        if (doc.getElementsByClassName("dccon_search_none").length > 0) {
          resolve([]);
          return;
        }

        const results = [...doc.getElementsByClassName("link_product")].map(
          (el) => {
            const idx = el.href.split("#")[1];
            const thumbId = el.children[0].src.split("=")[1];
            const name = el.children[1].innerText;
            const seller = el.children[2].innerText;

            return { idx, thumbId, name, seller };
          }
        );

        resolve(results);
      })
      .catch((err) => reject(err));
  });
};

// 버튼 컴포넌트
const Button = (props) => {
  return BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: `bd-button dccon-button ${props.color || ""}`,
      onClick: props.onClick,
      disabled: props.disabled,
      style: { ...props.style },
    },
    props.text
  );
};

// 디시콘 카드 컴포넌트 (검색 결과용)
class DCConCard extends BdApi.React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
    };
  }

  render() {
    const { item } = this.props;
    const existingDccon = this.props.savedDccons.find(
      (d) => d.info?.package_idx === item.idx
    );

    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      {
        className: "dccon-card",
      },
      BdApi.React.createElement("img", {
        src: `${DCConProxyURL}${item.thumbId}`,
        style: { borderRadius: "8px" },
      }),
      BdApi.React.createElement(
        "div",
        { className: "dccon-card-content" },
        BdApi.React.createElement("h3", {}, item.name),
        BdApi.React.createElement("span", {}, item.seller),
        BdApi.React.createElement(Button, {
          text: existingDccon
            ? strings.settings.added
            : this.state.isAdding
            ? strings.settings.adding
            : strings.settings.addDccon,
          disabled: existingDccon !== undefined || this.state.isAdding,
          onClick: async () => {
            if (this.state.isAdding) return;
            this.setState({ isAdding: true });

            try {
              const dcconData = await getDCCon(item.idx);
              const dccons = loadData("dccons", []);
              dccons.push(dcconData);
              saveData("dccons", dccons);

              this.props.onAdd(dcconData);
              BdApi.UI.showToast("디시콘이 추가되었습니다.", {
                type: "success",
              });
            } catch (err) {
              BdApi.Logger.error("DCCon", "디시콘 추가 실패:", err);
              BdApi.UI.showToast("디시콘 추가에 실패했습니다.", {
                type: "error",
              });
            }

            this.setState({ isAdding: false });
          },
          style: {
            marginTop: "auto",
            marginLeft: "auto",
          },
        })
      )
    );
  }
}

// 저장된 디시콘 카드 컴포넌트 (추가된 디시콘 관리용)
class SavedDCConCard extends BdApi.React.Component {
  render() {
    const { dccon } = this.props;
    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      {
        className: "dccon-card",
      },
      BdApi.React.createElement("img", {
        src: DCConProxyURL + dccon.info.main_img_path,
        style: { borderRadius: "8px" },
      }),
      BdApi.React.createElement(
        "div",
        { className: "dccon-card-content" },
        BdApi.React.createElement("h3", {}, dccon.info.title),
        BdApi.React.createElement(
          "span",
          {},
          `${dccon.detail.length}개의 디시콘`
        ),
        BdApi.React.createElement(Button, {
          text: strings.settings.remove,
          color: "dccon-item-error",
          onClick: () => {
            const dccons = loadData("dccons", []);
            const newDccons = dccons.filter(
              (d) => d.info.package_idx !== dccon.info.package_idx
            );
            saveData("dccons", newDccons);
            this.props.onRemove(dccon.info.package_idx);
            BdApi.UI.showToast("디시콘이 제거되었습니다.", { type: "success" });
          },
          style: {
            marginTop: "auto",
            marginLeft: "auto",
          },
        })
      )
    );
  }
}

// 설정 패널 컴포넌트
class DCConSettingsPanel extends BdApi.React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "saved",
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      savedDccons: loadData("dccons", []),
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  async handleSearch() {
    if (this.state.searchQuery.trim() === "") return;

    this.setState({ isSearching: true });

    try {
      const results = await getDCConSearchResult(this.state.searchQuery);
      this.setState({ searchResults: results });
    } catch (err) {
      BdApi.Logger.error("DCCon", "디시콘 검색 실패:", err);
      BdApi.UI.showToast("디시콘 검색에 실패했습니다.", { type: "error" });
    }

    this.setState({ isSearching: false });
  }

  handleTabChange(tab) {
    this.setState({ activeTab: tab });
  }

  renderSearch() {
    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      { className: "dccon-search-container" },
      BdApi.React.createElement(
        "div",
        { className: "dccon-search-bar" },
        BdApi.React.createElement("input", {
          type: "text",
          placeholder: strings.settings.searchDccon,
          value: this.state.searchQuery,
          onChange: (e) => this.setState({ searchQuery: e.target.value }),
          onKeyDown: (e) => {
            if (e.key === "Enter") this.handleSearch();
          },
        }),
        BdApi.React.createElement(Button, {
          text: this.state.isSearching
            ? strings.settings.adding
            : strings.settings.addDccon,
          disabled:
            this.state.isSearching || this.state.searchQuery.trim() === "",
          onClick: this.handleSearch,
          style: { marginLeft: "8px" },
        })
      ),
      BdApi.React.createElement(
        "div",
        { className: "dccon-search-results" },
        this.state.searchResults.length > 0
          ? this.state.searchResults.map((result) =>
              BdApi.React.createElement(DCConCard, {
                key: result.idx,
                item: result,
                savedDccons: this.state.savedDccons,
                onAdd: (dccon) => {
                  this.setState((state) => ({
                    savedDccons: [...state.savedDccons, dccon],
                  }));
                },
              })
            )
          : this.state.searchQuery !== "" && !this.state.isSearching
          ? BdApi.React.createElement(
              "div",
              { className: "dccon-empty-state" },
              strings.settings.noResults
            )
          : null
      )
    );
  }

  renderSaved() {
    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      { className: "dccon-saved-container" },
      this.state.savedDccons.length > 0
        ? this.state.savedDccons.map((dccon) =>
            BdApi.React.createElement(SavedDCConCard, {
              key: dccon.info.package_idx,
              dccon: dccon,
              onRemove: (idx) => {
                this.setState((state) => ({
                  savedDccons: state.savedDccons.filter(
                    (d) => d.info.package_idx !== idx
                  ),
                }));
              },
            })
          )
        : BdApi.React.createElement(
            "div",
            { className: "dccon-empty-state" },
            "추가된 디시콘이 없습니다. '디시콘샵' 탭에서 디시콘을 추가해보세요."
          )
    );
  }

  render() {
    const strings = getLocaleStrings();

    return BdApi.React.createElement(
      "div",
      { className: "dccon-settings-panel" },
      // 탭 메뉴
      BdApi.React.createElement(
        "div",
        { className: "dccon-tab-menu" },
        BdApi.React.createElement(
          "div",
          {
            className: `dccon-tab-item ${
              this.state.activeTab === "saved" ? "active" : ""
            }`,
            onClick: () => this.handleTabChange("saved"),
          },
          "내 디시콘"
        ),
        BdApi.React.createElement(
          "div",
          {
            className: `dccon-tab-item ${
              this.state.activeTab === "shop" ? "active" : ""
            }`,
            onClick: () => this.handleTabChange("shop"),
          },
          "디시콘샵"
        )
      ),
      // 탭 컨텐츠
      BdApi.React.createElement(
        "div",
        { className: "dccon-tab-content" },
        this.state.activeTab === "saved"
          ? this.renderSaved()
          : this.renderSearch()
      )
    );
  }
}
// #endregion

// 메인 플러그인 클래스
module.exports = class DCCon {
  constructor(meta) {
    this.meta = meta;
    this.strings = getLocaleStrings();
  }

  getSettingsPanel() {
    return BdApi.React.createElement(DCConSettingsPanel);
  }

  start() {
    loadEPS();

    // 기존 데이터 초기화
    if (loadData("dccons") === undefined) {
      saveData("dccons", []);
    }

    if (loadData("recent") === undefined) {
      saveData("recent", []);
    }

    this.patchExpressionPicker();
    this.patchChannelTextArea();
    this.patchClosePicker();

    BdApi.DOM.addStyle(this.meta.name, this.css);

    // 언어 변경 리스너 추가
    LocaleStore.addChangeListener(() => {
      this.strings = getLocaleStrings();
    });
  }

  stop() {
    BdApi.Patcher.unpatchAll(this.meta.name);
    Dispatcher.dispatch({ type: "DCCON_UNPATCH_ALL" });
    BdApi.DOM.removeStyle(this.meta.name);
  }

  async waitExpressionPicker() {
    return new Promise((resolve, reject) => {
      const unpatch = () => {
        reject(new Error("Plugin stopped"));
      };
      Dispatcher.subscribe("DCCON_UNPATCH_ALL", unpatch);
      observe(`.${classes.contentWrapper.contentWrapper}`, ($el) => {
        if ($el == null) return;
        Dispatcher.unsubscribe("DCCON_UNPATCH_ALL", unpatch);
        resolve(getOwnerInstance($el));
      });
    });
  }

  async patchExpressionPicker() {
    let ExpressionPicker = null;
    try {
      ExpressionPicker = await this.waitExpressionPicker();
    } catch {
      return;
    }

    if (ExpressionPicker == null) {
      BdApi.Logger.error(this.meta.name, "ExpressionPicker module not found");
      return;
    }

    ExpressionPicker.forceUpdate();

    BdApi.Patcher.after(
      this.meta.name,
      ExpressionPicker.constructor.prototype,
      "render",
      (_, __, returnValue) => {
        const originalChildren = returnValue.props?.children?.props?.children;
        if (originalChildren == null) return;

        returnValue.props.children.props.children = (...args) => {
          const childrenReturn = originalChildren(...args);
          const head = BdApi.Utils.findInTree(
            childrenReturn,
            (e) => e?.role === "tablist",
            { walkable: ["props", "children", "return", "stateNode"] }
          )?.children;
          const body = BdApi.Utils.findInTree(
            childrenReturn,
            (e) => e?.[0]?.type === "nav",
            { walkable: ["props", "children", "return", "stateNode"] }
          );
          if (head == null || body == null) return childrenReturn;

          try {
            const elementType = head[0].type.type;
            head.push(
              BdApi.React.createElement(
                elementType,
                {
                  id: "dccon-picker-tab",
                  "aria-controls": "dccon-picker-tab-panel",
                  "aria-selected":
                    EPS.useExpressionPickerStore.getState().activeView ===
                    "dccon",
                  className: "dccon-pickerTab",
                  viewType: "dccon",
                  isActive:
                    EPS.useExpressionPickerStore.getState().activeView ===
                    "dccon",
                },
                "디시콘"
              )
            );

            body.push(
              BdApi.React.createElement(DCConPanel, {
                type: EPS.useExpressionPickerStore.getState().activeView,
              })
            );
          } catch (err) {
            BdApi.Logger.error(
              this.meta.name,
              "Error in ExpressionPicker patch:",
              err.message ?? err
            );
          }

          return childrenReturn;
        };
      }
    );
  }

  patchChannelTextArea() {
    BdApi.Patcher.after(
      this.meta.name,
      ChannelTextArea.type,
      "render",
      (_, [props], returnValue) => {
        const isProfilePopout = BdApi.Utils.findInTree(
          returnValue,
          (e) =>
            Array.isArray(e?.value) &&
            e.value.some((v) => v === "bite size profile popout"),
          { walkable: ["children", "props"] }
        );
        if (isProfilePopout) return;

        const chatBar = BdApi.Utils.findInTree(
          returnValue,
          (e) =>
            Array.isArray(e?.children) &&
            e.children.some((c) =>
              c?.props?.className?.startsWith("attachButton")
            ),
          { walkable: ["children", "props"] }
        );
        if (!chatBar) return;

        currentChannelId = props.channel.id;
        const channel = props.channel;
        const perms = Permissions.can(
          PermissionsConstants.SEND_MESSAGES,
          channel
        );
        if (!channel.type && !perms) return;

        chatBar.children.push(
          BdApi.React.createElement(DCConButton, {
            pickerType: props.type,
            channelId: props.channel.id,
          })
        );
      }
    );
  }

  patchClosePicker() {
    BdApi.Patcher.instead(
      this.meta.name,
      EPSModules,
      closeExpressionPickerKey,
      (_, __, originalFunction) => {
        if (canClosePicker.value) originalFunction();
        if (canClosePicker.context === "dcconbutton")
          canClosePicker.value = true;
      }
    );
  }

  get css() {
    return `
        .dccon-buttonContainer {
        margin-left: 8px;
        }
        .dccon-pickerContainer {
        height: 100%
        }
        .dccon-emptyContainer {
        min-height: 300px;
        }
        
        /* 설정 패널 스타일 */
        .dccon-settings-panel {
        padding: 16px;
        }
        
        .dccon-tab-menu {
        display: flex;
        border-bottom: 1px solid var(--background-modifier-accent);
        margin-bottom: 20px;
        }
        
        .dccon-tab-item {
        padding: 8px 16px;
        margin-right: 8px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        color: var(--text-normal);
        }
        
        .dccon-tab-item.active {
        border-bottom: 2px solid var(--brand-experiment);
        font-weight: bold;
        color: var(--header-primary);
        }
        
        .dccon-search-bar {
        display: flex;
        margin-bottom: 16px;
        }
        
        .dccon-search-bar input {
        flex: 1;
        padding: 8px;
        border-radius: 4px;
        background: var(--background-secondary);
        border: 1px solid var(--background-tertiary);
        color: var(--text-normal);
        }
        
        .dccon-search-results, .dccon-saved-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 16px;
        }
        
        .dccon-card {
        display: flex;
        background-color: var(--background-secondary);
        border-radius: 8px;
        padding: 12px;
        height: 120px;
        }
        
        .dccon-card img {
        width: 100px;
        height: 100px;
        object-fit: contain;
        margin-right: 12px;
        }
        
        .dccon-card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        }
        
        .dccon-card-content h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: var(--header-primary);
        }
        
        .dccon-card-content span {
        color: var(--header-secondary);
        font-size: 14px;
        }
        
        .dccon-empty-state {
        grid-column: 1 / -1;
        padding: 32px;
        text-align: center;
        color: var(--text-normal);
        background-color: var(--background-secondary);
        border-radius: 8px;
        }
        
        .dccon-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        }
        
        .dccon-category {
        background: var(--background-secondary);
        border-radius: 8px;
        overflow: hidden;
        }
        
        .dccon-category-header {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        user-select: none;
        background: var(--background-tertiary);
        }
        
        .dccon-category-header:hover {
        background: var(--background-modifier-hover);
        }
        
        .dccon-category-icon {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        margin-right: 8px;
        }
        
        .dccon-recent-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--interactive-normal);
        }
        
        .dccon-category-name {
        flex: 1;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-normal);
        }
        
        .dccon-category-toggle {
        margin-left: 8px;
        }
        
        .dccon-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
        padding: 12px;
        }
        
        .dccon-item {
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--background-secondary-alt);
        }
        
        .dccon-item:hover {
        background: var(--background-modifier-hover);
        }
        
        .dccon-item img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        }
        
        .dccon-item-error {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-danger);
        font-size: 12px;
        text-align: center;
        }

        .dccon-button {
            color: var(--text-normal);
        }

        .dccon-scroller {
            height: 100%;
            overflow-y: auto;
        }
    `;
  }
};
