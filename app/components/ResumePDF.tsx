"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { categorizeSkills } from "@/app/utils/skillCategorizer";

// Score estimation for dynamic font sizing
const estimateContentScore = (resume: any) => {
  let score = 100;
  score += (resume.education?.length || 0) * 10;
  score +=
    resume.experience?.reduce(
      (acc: number, exp: any) => acc + (exp.description?.length || 1),
      0
    ) * 5;
  score +=
    resume.projects?.reduce(
      (acc: number, proj: any) => acc + (proj.description?.length || 1),
      0
    ) * 4;
  score += (resume.certifications?.length || 0) * 6;
  score += Object.keys(categorizeSkills(resume.skills || "")).length * 5;
  return score;
};

const getFontSize = (score: number) => {
  if (score < 100) return 13;
  if (score < 130) return 12;
  if (score < 170) return 11;
  if (score < 200) return 10.5;
  return 10;
};

const ResumePDF = ({ resume }: { resume: any }) => {
  if (!resume) return null;

  const skillSections = categorizeSkills(resume.skills || "");
  const fontSize = getFontSize(estimateContentScore(resume));

  const styles = StyleSheet.create({
    page: {
      padding: 28,
      fontSize,
      fontFamily: "Helvetica",
      lineHeight: 1.4,
      backgroundColor: "#ffffff",
    },
    section: {
      marginBottom: 10,
      paddingBottom: 6,
      borderBottom: "1 solid #e5e7eb",
    },
    title: {
      fontSize: fontSize + 6,
      fontWeight: "bold",
      color: "#000000",
      marginBottom: 2,
    },
    heading: {
      fontSize: fontSize + 2,
      fontWeight: "bold",
      color: "#7e22ce",
      marginBottom: 6,
      marginTop: 10,
    },
    label: {
      fontWeight: "bold",
      color: "#1d4ed8",
    },
    textRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    listItem: {
      marginLeft: 10,
      marginBottom: 2,
      fontSize: fontSize + 1,
    },
    subText: {
      fontSize: fontSize - 1,
      fontStyle: "italic",
      color: "#6b7280",
    },
    bold13: {
      fontWeight: "bold",
      fontSize: 13,
    },
    link13: {
      fontSize: 13,
      color: "#2563eb",
      textDecoration: "underline",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>{resume.fullName}</Text>
          <View style={styles.textRow}>
            <Text>
              <Text style={styles.label}>GitHub:</Text> {resume.github || "N/A"}
            </Text>
            <Text>
              <Text style={styles.label}>Email:</Text> {resume.email || "N/A"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text>
              <Text style={styles.label}>LinkedIn:</Text>{" "}
              {resume.linkedin || "N/A"}
            </Text>
            <Text>
              <Text style={styles.label}>Phone:</Text> {resume.phone || "N/A"}
            </Text>
          </View>
          {resume.portfolio && (
            <Text>
              <Text style={styles.label}>Portfolio:</Text> {resume.portfolio}
            </Text>
          )}
          {resume.location && (
            <Text style={styles.subText}>{resume.location}</Text>
          )}
        </View>

        {/* Education */}
        {resume.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>EDUCATION</Text>
            {resume.education.map((edu: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.textRow}>
                  <Text style={{ fontWeight: "bold", fontSize: fontSize }}>
                    {edu.institution}
                  </Text>
                  <Text style={{ color: "#4b5563", fontSize: fontSize }}>
                    {edu.duration}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={{ fontSize: fontSize }}>{edu.degree}</Text>
                  {edu.cgpa && (
                    <Text
                      style={{
                        color: "#374151",
                        fontWeight: 500,
                        fontSize: fontSize,
                      }}
                    >
                      CGPA: {edu.cgpa}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {Object.keys(skillSections).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>SKILLS SUMMARY</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {Object.entries(skillSections).map(([category, skills]) => (
                <View
                  key={category}
                  style={{
                    width: "48%", // Two columns with some space between
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: fontSize - 0.2 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#000000", // black category label
                      }}
                    >
                      {category
                        .replace(/([A-Z])/g, " $1")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                      :
                    </Text>{" "}
                    {skills.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>WORK EXPERIENCE</Text>
            {resume.experience.map((exp: any, idx: number) => (
              <View key={idx} style={{ marginTop: 4 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSize + 1,
                    }}
                  >
                    {exp.role} | {exp.company}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize - 0.5,
                      color: "#6b7280", // Tailwind's text-gray-500
                    }}
                  >
                    {exp.duration}
                  </Text>
                </View>

                {exp.description?.map((desc: string, i: number) => (
                  <Text
                    key={i}
                    style={{
                      marginLeft: 10,
                      marginTop: 2,
                      fontSize: fontSize - 0.3,
                      color: "#374151", // Tailwind's text-gray-700
                      lineHeight: 1.4,
                    }}
                  >
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>PROJECTS</Text>
            {resume.projects.map((proj: any, idx: number) => (
              <View key={idx}>
                <View style={styles.textRow}>
                  <Text style={{ fontWeight: "bold", fontSize: fontSize + 1 }}>
                    {proj.title}
                  </Text>
                  <Text style={{ fontSize: fontSize }}>{proj.duration}</Text>
                </View>
                {proj.description?.map((desc: string, i: number) => (
                  <Text key={i} style={styles.listItem}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
          <View>
            <Text style={styles.heading}>CERTIFICATIONS</Text>
            {resume.certifications.map((cert: any, idx: number) => (
              <View key={idx}>
                <Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSize + 0.5, // slightly reduced
                      color: "#000000",
                    }}
                  >
                    {cert.name} ({cert.issuer})
                  </Text>{" "}
                  |{" "}
                  <Link
                    src={cert.link}
                    style={{
                      fontSize: fontSize + 0.5, // same size as name
                      color: "#2563eb", // blue-600
                      textDecoration: "underline",
                    }}
                  >
                    Link
                  </Link>
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: fontSize,
                    color: "#374151", // gray-700
                  }}
                >
                  {cert.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
