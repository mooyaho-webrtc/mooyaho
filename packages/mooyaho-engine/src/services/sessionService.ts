import prisma from '../lib/prisma'

const sessionService = {
  async integrate(sessionId: string, userJSONString: any) {
    const parsed = JSON.parse(userJSONString)
    if (parsed.id === undefined) {
      const e = new Error('There is no id field in user json')
      throw e
    }
    // 사용자 존재 여부
    let user = await prisma.user.findUnique({
      where: {
        id: parsed.id,
      },
    })
    // 있으면 업데이트하고, 없으면 새로 생성
    if (user) {
      await prisma.user.update({
        where: {
          id: parsed.id,
        },
        data: {
          json: userJSONString,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          id: parsed.id,
          json: userJSONString,
        },
      })
    }

    let session = await prisma.session.findUnique({ where: { id: sessionId } })
    if (!session) {
      session = await prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
        },
      })
    }

    return { session, user: parsed }
  },
  async getUserBySessionId(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
      },
    })
    if (!session) {
      return null
    }
    const parsed: SessionUser = JSON.parse(session.user.json)
    return parsed
  },
}

export type SessionUser = { id: string; [key: string]: any }

export default sessionService
