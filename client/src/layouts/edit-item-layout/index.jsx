/* eslint-disable no-unused-vars */
import * as SeparatorRadix from "@radix-ui/react-separator"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { FormProvider } from "react-hook-form"
import { MdArrowBack } from "react-icons/md"
import { SWRConfig } from "swr"

import { useHandleToast } from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  HeaderPage,
  TitlePage,
} from "@/components"

import { toCapitalize } from "@/utils"

import {
  BackButton,
  CancelButton,
  ContinueButton,
  CreateNewItemSection,
  SubmitButton,
} from "./components"

export const EditItemLayout = ({
  children = null,
  methods = {},
  onSubmit = () => {},
  onError = () => {},
  title = "",
  root = "/",
  rootPath = "/",
  sectionRoot = "",
  sectionRootPath = "/",
  sectionItems = [],
  stepsObject = [],
}) => {
  const { back } = useRouter()
  const { query, replace, asPath } = useRouter()

  const [currentActiveSectionNumber, setCurrentActiveSectionNumber] =
    useState(1)

  const currentActiveSection = useMemo(() => {
    const activeSection = sectionItems.find(
      (item) => item.numberOfSection === currentActiveSectionNumber
    )
    const activeStep = stepsObject && stepsObject[currentActiveSectionNumber]
    return { activeStep, ...activeSection }
  }, [currentActiveSectionNumber])

  const prevAndNextSections = useMemo(() => {
    const nextActiveSection = sectionItems.find(
      (item) => item.numberOfSection === currentActiveSectionNumber + 1
    )

    const prevActiveSection = sectionItems.find(
      (item) => item.numberOfSection === currentActiveSectionNumber - 1
    )

    return { nextActiveSection, prevActiveSection }
  }, [currentActiveSectionNumber])

  const pathnames = useMemo(() => {
    return asPath
      .split("/")
      .filter(Boolean)
      .map((item) => ({
        title:
          item === query.slug
            ? query.slug
            : toCapitalize(item.replace(/[-]/gi, " ")),
        href: item,
      }))
  }, [asPath])

  return (
    <>
      <Head>
        <title>
          {currentActiveSection.sectionTitle} - {title} | Noble Property Asia
          Database Management System
        </title>
      </Head>

      <HeaderPage>
        <div className="flex items-center gap-4">
          <button onClick={() => back()}>
            <MdArrowBack className="h-5 w-5" />
          </button>
          <TitlePage>{title}</TitlePage>
        </div>

        <BreadcrumbsContainer>
          {pathnames.map((pathname) => (
            <BreadcrumbsItem
              href={rootPath}
              disabled={pathname.href !== root}
              key={pathname.title}
            >
              {pathname.title}
            </BreadcrumbsItem>
          ))}
        </BreadcrumbsContainer>
      </HeaderPage>

      <div className="flex flex-col items-center gap-14 rounded-md bg-white p-4 md:p-8">
        <section className="flex w-full flex-col gap-4">
          <CreateNewItemSection
            sectionItems={sectionItems}
            root={root}
            sectionRoot={sectionRoot}
            slug={query.slug}
            setCurrentActiveSectionNumber={setCurrentActiveSectionNumber}
            currentActiveSectionNumber={currentActiveSectionNumber}
          />
          <SeparatorRadix.Root className="h-[1px] bg-npa-neutral-900" />
        </section>

        <section className="flex w-full flex-col items-center gap-14">
          <FormProvider {...methods}>
            <form
              id={`form-${title}`}
              className="flex w-full flex-col items-center gap-12"
            >
              <div className="flex w-full flex-col gap-8 px-3 md:px-6 xl:max-w-4xl xl:px-8 2xl:max-w-5xl">
                <div className="flex w-full flex-col gap-2 font-medium">
                  <h3 className="text-sm text-npa-info-400">
                    {currentActiveSection.activeStep}
                  </h3>
                  <h2 className="text-xl">
                    {currentActiveSection.sectionTitle}
                  </h2>
                </div>
                <div className="flex w-full flex-col gap-6">
                  <SWRConfig
                    value={{
                      keepPreviousData: false,
                      refreshInterval: 0,
                      revalidateOnFocus: false,
                    }}
                  >
                    {children}
                  </SWRConfig>
                </div>
              </div>

              <SeparatorRadix.Root className="h-[1px] w-full bg-npa-neutral-900" />

              <div className="flex w-full items-center justify-between gap-8 px-3 md:px-6 xl:max-w-4xl xl:px-8 2xl:max-w-5xl">
                {currentActiveSection.sectionTitle !==
                sectionItems[0].sectionTitle ? (
                  <BackButton
                    root={root}
                    replace={replace}
                    sectionRoot={sectionRoot}
                    onCurrentActiveSectionNumber={setCurrentActiveSectionNumber}
                    prevActiveSectionTo={
                      prevAndNextSections.prevActiveSection?.to
                    }
                  />
                ) : (
                  <CancelButton
                    root={root}
                    replace={replace}
                    currentSectionTitle={currentActiveSection.sectionTitle}
                    onCurrentActiveSectionNumber={setCurrentActiveSectionNumber}
                    prevActiveSectionTo={
                      prevAndNextSections.prevActiveSection?.to
                    }
                    isDirtyFields={
                      Object.keys(methods.formState.dirtyFields).length > 0
                    }
                  />
                )}

                {currentActiveSection.sectionTitle ===
                sectionItems[sectionItems.length - 1].sectionTitle ? (
                  <SubmitButton
                    sectionRoot={sectionRoot}
                    methods={methods}
                    onSubmit={onSubmit}
                    onError={onError}
                    showAndCloseOnly={false}
                    isDirtyFields={
                      Object.keys(methods.formState.dirtyFields).length >= 1
                    }
                    isSubmitting={methods.formState.isSubmitting}
                  />
                ) : (
                  <ContinueButton
                    root={root}
                    replace={replace}
                    sectionRoot={sectionRoot}
                    isSubmitting={methods.formState.isSubmitting}
                    onCurrentActiveSectionNumber={setCurrentActiveSectionNumber}
                    nextActiveSectionTo={
                      prevAndNextSections.nextActiveSection?.to
                    }
                  />
                )}
              </div>
            </form>
          </FormProvider>
        </section>
      </div>
    </>
  )
}

export const getEditItemLayout = (page) => {
  return <EditItemLayout>{page}</EditItemLayout>
}
