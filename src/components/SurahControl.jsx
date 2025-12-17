import React from 'react'
import InputSelect from './InputSelect';
import { t } from 'i18next';

const SurahControl = ({
  ayats,
  currentVerse,
  handleVerse,
  surahs,
  surahName,
  handleSurahs,
  juzzList,
  handleJuzz,
  viewOptions,
  currentView,
  handleView,
  findAllRuku,
  currentRuku,
  setCurrentRuku,
  getScripts,
    handleScripts,
    volume,
    setVolume,
    recitor,
    currentRecitor,
}) => {
  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap border divide-x divide-gray-200">
        {/* First Section */}
        <div className="w-full md:w-5/12 p-2">
          <div className="space-y-2 p-2">
            {/* First Row: 2 items on desktop, 1 per row on mobile */}
            <div className="flex flex-wrap md:flex-nowrap gap-2">
              <div className="w-full md:flex-1">
                <InputSelect
                  label={t("Verse")}
                  optionLabel="ayatIndex"
                  options={ayats}
                  value={currentVerse}
                  onChange={handleVerse}
                />
              </div>

              <div className="w-full md:flex-1">
                <InputSelect
                  label={t("Surahs")}
                  optionLabel="mainName"
                  optionValue="_id"
                  options={surahs}
                  value={surahName}
                  onChange={handleSurahs}
                />
              </div>
              <div className="w-full md:flex-1">
                <InputSelect
                  label={t("Juz")}
                  optionLabel="mainName"
                  optionValue="_id"
                  options={juzzList}
                  onChange={handleJuzz}
                />
              </div>
            </div>

            {/* Second Row: 3 items on desktop, stack on mobile */}
            <div className="flex flex-wrap md:flex-nowrap gap-2">
              <div className="w-full md:flex-1">
                <InputSelect
                  label={t("View")}
                  optionLabel="label"
                  optionValue="value"
                  options={viewOptions}
                  value={currentView}
                  onChange={handleView}
                />
              </div>
              <div className="w-full md:flex-1">
                <InputSelect
                  label={t("Ruku")}
                  optionLabel="rukuNo"
                  optionValue="rukuNo"
                  placeholder="dd"
                  options={findAllRuku}
                  value={currentRuku}
                  onChange={(e) => setCurrentRuku(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Section - Script & Reciter */}
        <div className="w-full md:w-3/12 p-2">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <InputSelect
                  label={t("Script")}
                  optionLabel="name"
                  optionValue="_id"
                  options={getScripts}
                  onChange={handleScripts}
                />
              </div>
              {volume ? (
                <Volume2
                  size={19}
                  className="cursor-pointer"
                  onClick={() => setVolume(false)}
                />
              ) : (
                <VolumeOff
                  size={19}
                  className="cursor-pointer"
                  onClick={() => setVolume(true)}
                />
              )}
            </div>
            <div className="flex-1">
              <InputSelect
                label={t("Reciter")}
                optionLabel="name"
                optionValue="_id"
                options={recitor}
                value={currentRecitor}
                onChange={handleRecitor}
              />
            </div>
          </div>
        </div>

        {/* Third Section - Translation */}
        <div className="w-full md:w-2/12 p-2">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <p className="m-0 whitespace-nowrap">{t("Translation")}</p>
              {translationVolume ? (
                <Volume2
                  size={19}
                  className="cursor-pointer"
                  onClick={() => setTranslationVolume(false)}
                />
              ) : (
                <VolumeOff
                  size={19}
                  className="cursor-pointer"
                  onClick={() => setTranslationVolume(true)}
                />
              )}
            </div>
            <div className="flex-1">
              <InputSelect
                value={languageId}
                optionValue="_id"
                optionLabel="name"
                options={translation}
                onChange={handleLanguage}
              />
            </div>
          </div>
        </div>

        {/* Fourth Section - Range */}
        <div className="w-full md:w-2/12 p-2">
          <div className="p-2">
            <InputRange
              labelStart="س"
              labelEnd="س"
              min={0}
              max={100}
              step={1}
              value={fontSize}
              onChange={handleFontSizeChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SurahControl