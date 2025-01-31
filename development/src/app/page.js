'use client';
import Welcome from '@/components/welcome_comp';
import EditorNavBar from '@/components/navbar_components/editorNavbar_comp';
import SideNavBarControl from '@/components/navbar_components/sidebar_components/sideBarNavControl';
import TabBarControls from '@/components/navbar_components/tabbar_components/tabBarControls_comp';
import { useSearchParams, useRouter } from 'next/navigation';
import { Modal } from '@/components/modal';
import { OpenTabModal } from '@/components/openTabModal_comp';
import { useTabContext } from '@/composables/tabContext';
import Collab from '@/components/collab_comp';
import { useEffect } from 'react';
import ErrorModal from '@/components/errorModal_comp';
import UserLoginComp from '@/components/userLogin_comp';
import SignUpComponent from '@/components/signup_comp';
import SessionComp from '@/components/session_comp';

function Home() {
  const { items, setItems, errorMessage, setErrorMessage } = useTabContext();
  const view = useSearchParams().get('view');
  const router = useRouter();

  const handleTabActive = (tab) => {
    const index = items.findIndex((i, k) => k === tab);
    const newItems = items.map((item, idx) => ({
      ...item,
      active: idx === index,
    }));
    setItems(newItems);
  };
  const handleTabClose = (tab) => {
    const index = items.findIndex((i, k) => k === tab);
    const newItems = items.map((item, idx) => ({
      ...item,
      active: setActive(idx, index),
    }));
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const setActive = (idx, index) => {
    if (idx === index) {
      return false;
    } else if (idx === index - 1) {
      return index + 1 <= items.length - 1 ? false : true;
    } else if (idx === index + 1) {
      return true;
    } else {
      return false;
    }
  };

  const handleTabRename = (tab, event) => {
    const index = items.findIndex((i, k) => k === tab);
    const currentTab = event.target;
    const initialName = currentTab.textContent;

    const form = document.createElement('form');
    currentTab.replaceChildren(form);
    const inputField = document.createElement('input');
    inputField.value = initialName;
    form.appendChild(inputField);
    const currentTabChild = currentTab.firstChild;
    currentTabChild[0].focus();
    currentTabChild[0].select();

    currentTabChild.addEventListener('submit', tabRenameSubmitHandler, {
      once: true,
    });
    currentTabChild.addEventListener('focusout', tabRenameFocusHandler, {
      once: true,
    });

    function tabRenameSubmitHandler(e) {
      currentTabChild.removeEventListener('focusout', tabRenameFocusHandler);
      e.preventDefault();
      const newName = e.target[0].value;
      setTabName(newName);
    }

    function tabRenameFocusHandler(e) {
      currentTabChild.removeEventListener('submit', tabRenameSubmitHandler);
      const currentName = e.target.value;
      setTabName(currentName);
    }

    function setTabName(name) {
      const newItems = items.map((item, idx) => ({
        ...item,
        title: idx === index ? name : item.title,
      }));
      setItems(newItems);
      currentTab.replaceChildren(name);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 6000);
  }, [errorMessage]);

  return (
    <>
      <main className="h-full bg-[#DCDCE5] dark:bg-[#2F2F3A] relative">
        <ErrorModal
          errorMessage={errorMessage}
          style={'absolute z-50 top-3 right-0 mr-2 '}
          onClose={() => setErrorMessage('')}
        />
        <div className="relative h-full border-gray-300 border-b-[1px] dark:border-gray-700 ">
          <EditorNavBar />
        </div>
        <div className="relative flex w-full">
          <div>
            <SideNavBarControl
              handleTopNavClicks={(i) => {
                handleButtonClicks(i);
              }}
            />
          </div>
          <div className="ml-24 w-[80%]">
            <TabBarControls
              items={items}
              handleActiveTab={(i, event) => {
                event.stopPropagation();
                handleTabActive(i);
              }}
              handleCloseTab={(i, event) => {
                event.stopPropagation();
                handleTabClose(i);
              }}
              handleRenameTab={(i, event) => {
                event.stopPropagation();
                handleTabRename(i, event);
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E2A]  ml-24 w-[92.9%] h-screen flex flex-col justify-start">
          <>
            {view == 'quicklinks' ? (
              <Modal
                onClose={() => {
                  router.push('/');
                }}>
                <OpenTabModal
                  onClose={() => {
                    router.push('/');
                  }}
                />
              </Modal>
            ) : view == 'login' ? (
              <Modal
                onClose={() => {
                  router.push('/');
                }}>
                <UserLoginComp />
              </Modal>
            ) : view == 'signup' ? (
              <Modal
                onClose={() => {
                  router.push('/');
                }}>
                <SignUpComponent />
              </Modal>
            ) : (
              <div></div>
            )}

            {items.map((item) => {
              if (item?.active && item.title === 'Welcome') {
                return (
                  <div className="p-11">
                    <Welcome />
                  </div>
                );
              } else if (item.active && item.title == 'collab') {
                return <div> <SessionComp /> </div>;
              } else if (item.active && item.title != 'Welcome') {
                return <Collab key={item.id} />;
              }
            })}
          </>
        </div>
      </main>
    </>
  );
}

export default Home;
